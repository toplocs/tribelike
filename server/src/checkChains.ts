import Gun, { SEA } from 'gun';
import http from 'http';

const validationHandler = function validationHandler(this: any, msg: any) {
    console.log('=== VALIDATION HANDLER ===');
    console.log('Incoming message:', JSON.stringify(msg, null, 2));
    
    // Safety check: ensure we have a valid message
    if (!msg || typeof msg !== 'object') {
        console.log('⚠️ Invalid message received, skipping validation');
        return; // Don't continue if message is invalid
    }
    
    // Check if this is a put operation with data
    if (msg.put) {
        for (const [soul, node] of Object.entries(msg.put)) {
            console.log(`Validating node: ${soul}`);
            
            // Example validation: reject any data containing profanity
            if (node && typeof node === 'string') {
                if (node.includes('badword') || node.includes('spam')) {
                    console.log(`❌ VALIDATION FAILED: Node ${soul} contains prohibited content`);
                    console.log('🚫 DATA BLOCKED - NOT calling this.to.next()');
                    
                    // Simply return without calling this.to.next(msg) - this blocks the chain
                    // Don't send error acknowledgments here to avoid disrupting Gun's internal flow
                    return; // ← Critical: Don't call this.to.next(msg) to block storage
                }
            }
            
            // Example validation: check required fields for user profiles
            if (soul.startsWith('~') && node) { // User profile node
                const nodeData = node as any; // Type assertion for Gun node data
                if (nodeData.alias && typeof nodeData.alias !== 'string') {
                    console.log(`❌ VALIDATION FAILED: Invalid alias type for user ${soul}`);
                    console.log('🚫 DATA BLOCKED - NOT calling this.to.next()');
                    
                    return; // ← Block storage
                }
            }
        }
        
        console.log('✅ VALIDATION PASSED - calling this.to.next()');
    }
    
    // If we reach here, validation passed, continue the chain
    if (this.to && this.to.next) {
        this.to.next(msg);
    }
};

Gun.on('opt', function (context: any) {
    // console.log('gun - tag.hi:', context.tag.hi);
    
    // Register validation handlers first (they run before storage)
    context.on('put', validationHandler);
    
    this.to.next(context);
});

function createAnalyzer() {
  console.log('Creating analyzer...');
  
  // Create a minimal HTTP server to initialize Gun
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Gun Chain Analyzer Server');
  });
  
  server.on('error', (err) => {
    console.error('Server error:', err);
  });
  
  server.listen(8765, async () => {
    try {
      console.log('Analysis server running on port 8765');
      
      // Initialize Gun with our server
      const options = {
          peers: [],
          multicast: false,
          file: 'ra-data',
          web: server,
          radisk: true,
      };

      const gun = Gun(options);
      console.log('Gun initialized');
      

      // Helper function to inspect a chain with detailed information
      function inspectChain(type: string) {
        const context = gun._;
        const tag = (context as any).tag;
        if (tag && tag[type] && tag[type].to) {
          let handler = tag[type].to;
          let index = 0;
          
          console.log(`\n${type.toUpperCase()} chain:`);
          while (handler) {
            // Show function details
            if (typeof handler === 'function') {
              console.log(`    - Function: ${handler.name || 'anonymous function'}`);
            } else {
              console.log(`    - Function: not a function`);
            }
            
            // Show string representation (truncated)
            const handlerStr = handler.toString();
            const truncatedStr = handlerStr.length > 200 ? handlerStr.substring(0, 200) + '...' : handlerStr;
            console.log(`    - toString: ${truncatedStr}`);
            
            // Show more handler properties for better analysis
            console.log(`    - Type: ${typeof handler}`);
            if (handler.constructor && handler.constructor.name) {
              console.log(`    - Constructor: ${handler.constructor.name}`);
            }
            
            // If this handler has nested handlers
            if (handler.to && handler.to.next) {
              console.log(`    └─> Contains nested handlers`);
              
              // Traverse nested handlers to show the complete chain
              let nestedHandler = handler.to;
              let nestedIndex = 0;
              console.log(`        Nested chain within [${index}]:`);
              while (nestedHandler && nestedIndex < 10) { // Limit to prevent infinite loops
                
                console.log(`        [${index}.${nestedIndex}]`);
                
                if (typeof nestedHandler === 'function') {
                  console.log(`            - Function: ${nestedHandler.name || 'anonymous'}`);
                } else {
                  console.log(`            - Type: ${typeof nestedHandler}`);
                }
                
                nestedHandler = nestedHandler.next;
                nestedIndex++;
              }
            }
            
            handler = handler.next;
            index++;
          }
          
          // Additionally, let's inspect the full chain structure
          console.log(`\n${type.toUpperCase()} chain summary:`);
          console.log(`- Total top-level handlers: ${index}`);
          if (tag[type].last) {
            console.log(`- Has 'last' handler: ${!!tag[type].last}`);
          }
        } else {
          console.log(`No ${type} chain found`);
        }
      }
      
      inspectChain('put');

      
      // Add test examples section
      console.log('\n\n===== TESTING VALIDATION HANDLERS =====');
      
      // Create test functions
      await runValidationTests(gun);

      console.log('\nPress Ctrl+C to exit...');
    } catch (error) {
      console.error('Error in analyzer:', error);
      process.exit(1);
    }
  });
}

/**
 * Test Examples: Demonstrates validation handlers with valid and invalid data
 */
async function runValidationTests(gun: any) {
  console.log('\n--- Starting Validation Handler Tests ---');
  
  // Test 1: Valid user profile data (should pass all validations)
  console.log('\n🧪 TEST 1: Valid user profile data');
  const validUserData = {
    alias: 'john_doe',
    profile: {
      name: 'John Doe',
      bio: 'Software developer from San Francisco',
      interests: 'coding'
    }
  };
  
  await testPutMessage(gun, 'felix', validUserData, 'Valid user profile');
  
  // Test 2: Invalid content with profanity (should be blocked by validation handler)
  console.log('\n🧪 TEST 2: Content with prohibited words');
  const profanityData = {
    alias: 'bad_user',
    message: 'This contains badword and should be blocked',
    spam: 'This is spam content'
  };
  
  await testPutMessage(gun, '~user2', profanityData, 'Content with profanity/spam');
}

/**
 * Helper function to test a put message through the validation chain
 */
async function testPutMessage(
  gun: any, 
  soul: string, 
  data: any, 
  testDescription: string,
  verbose: boolean = true
): Promise<void> {
  return new Promise((resolve) => {
    if (verbose) {
      console.log(`\n  📝 ${testDescription}:`);
      console.log(`     Soul: ${soul}`);
      console.log(`     Data: ${JSON.stringify(data, null, 6)}`);
    }
    
    // Create a Gun reference and attempt to put the data
    const ref = gun.get(soul);
    
    // Listen for acknowledgment (success or error)
    ref.put(data, (ack: any) => {
      if (verbose) {
        if (ack.err) {
          console.log(`     ❌ BLOCKED: ${ack.err}`);
        } else {
          console.log(`     ✅ ACCEPTED: Data written successfully`);
        }
      } 
      resolve();
    });
  });
}

// Run the analyzer
console.log('Starting Gun.js Chain Analyzer...');
createAnalyzer();