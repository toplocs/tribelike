# Gun.js Debug Tools

## Quick Start

### Development
Debug tools are automatically enabled when running `pnpm dev`.

### Production
There are two ways to enable debug logging in production:

1. **URL Parameter** - Add `?debug=true` to any deployment:
   ```
   https://example.com?debug=true
   ```

2. **Build-time Flag** - Enable for all users via GitHub Actions:
   - When deploying, check "Enable debug mode" in workflow inputs
   - Sets `VITE_DEBUG_MODE=true` during build
   - Useful for troubleshooting deployment issues

## URL Parameters

### Basic Usage
- `?debug=true` - Enable full debug logging
- `?debug=silent` - Logger active but no console output
- `&quiet` - Suppress activation messages

**Important for Hash Routing**: Query parameters must come BEFORE the hash (#):
- ✅ Correct: `https://example.com?debug=true#/login`
- ❌ Wrong: `https://example.com#/login?debug=true`

### Filtered Debugging
Debug specific Gun.js operations:
- `?debug=peer` - Only peer connections
- `?debug=get` - Only GET operations
- `?debug=put` - Only PUT operations
- `?debug=subscribe` - Only subscriptions
- `?debug=get,put` - Multiple types (comma-separated)

### Examples

**With History Mode (clean URLs):**
```bash
# Full debug
https://example.com?debug=true

# Only peer connections, no hints
https://example.com?debug=peer&quiet

# Silent mode (logs stored but not displayed)
https://example.com?debug=silent
```

**With Hash Mode (default for GitHub Pages):**
```bash
# Full debug on landing page
https://example.com?debug=true#/

# Debug on login page
https://example.com?debug=true#/login

# Only peer connections on profiles page
https://example.com?debug=peer#/profiles

# Multiple parameters
https://example.com?debug=true&quiet#/sphere/123

# GitHub Pages default URL example
https://toplocs.github.io/tribelike/?debug=true#/login
```

## Console Commands

The Gun.js logger provides these global commands:

```javascript
gunStats()     // Show current statistics
gunRecent()    // Show last 10 events
gunRecent(20)  // Show last 20 events
gunClear()     // Clear log history
gunGraph()     // Show complete local graph
gunStorage()   // Show Gun data in localStorage
gunWatch(path) // Watch a specific path for changes
gun            // Direct Gun instance access
```

### Full logger object access:
```javascript
gunLog.printStats()   // Same as gunStats()
gunLog.showRecent()   // Same as gunRecent()
gunLog.getStats()     // Get raw stats object
gunLog.getEvents()    // Get all logged events
gunLog.clear()        // Same as gunClear()
```

## What Gets Logged

### Gun.js Operations
- **GET** (🟢 green) - Data requests
- **PUT** (🔵 blue) - Data writes (includes size)
- **SUBSCRIBE** (🟣 purple) - Real-time subscriptions
- **PEER** (🟠 orange) - Peer connection status

### Example Output
```
[Gun.GET] profile/123 {timestamp: 1701234567890}
[Gun.PUT] profile {timestamp: 1701234567891, size: 256}
[Gun.SUBSCRIBE] relations {timestamp: 1701234567892}
[Gun.PEER] https://example.com/gun {status: "connected"}
```

## Debugging Common Issues

### Check Peer Connections
```javascript
gunStats()
// Output:
// 📊 Gun Stats
// Graph Nodes: 234
// Connected Peers: 1/2
// Logged Events: 45
// Memory: 12.34 MB
```

### Monitor Specific Data
```javascript
// Watch for specific paths in real-time
gunWatch('profile/123')  // Logs all updates to this path
gunWatch('relations')    // Monitor relations changes

// Check recent activity
gunRecent()  // Shows recent activity

// Then trigger an action in the app and run again:
gunRecent()  // See what Gun.js operations happened

// Inspect the local graph
gunGraph()  // Shows all data nodes in memory

// Check localStorage
gunStorage()  // Shows all Gun-related keys
```

### Find Performance Issues
```javascript
// Check graph size
gunStats()  // Large graph nodes count = potential memory issue

// Monitor subscription patterns
// Use ?debug=subscribe to see all real-time listeners
```

### Debug Connection Problems
```bash
# Only show peer connections
https://example.com?debug=peer

# Watch the console for:
# [Gun.PEER] url {status: "disconnected"}
# [Gun.PEER] url {status: "connected"}
```

### Direct Gun Access
```javascript
// Direct Gun.js operations for advanced debugging
gun.get('profile/123').once(console.log)  // Read data once
gun.get('relations').map().on(console.log) // Monitor all relations

// Check Gun internals
gun._.opt      // Gun options
gun._.graph    // In-memory graph
gun.back('opt.peers')  // Peer connections
```

### Adding Peers Dynamically

If you deployed to GitHub Pages without peers, you can add them later via the browser console:

```javascript
// First, enable debug mode to access gun instance
// Visit: https://toplocs.github.io/tribelike/?debug=true#/

// Add a single peer (use wss:// for WebSocket connections)
gun.opt({peers: ['wss://example.com/gun']})

// Add multiple peers
gun.opt({peers: ['wss://peer1.com/gun', 'wss://peer2.com/gun']})

// Check current peers and their status
gun.back('opt.peers')

// Monitor peer connection status
gunStats()  // Shows connected peers count

// Example with real Gun.js public peers
gun.opt({peers: ['wss://gun-manhattan.herokuapp.com/gun']})

// Note: This adds to existing peers, doesn't replace them
// Data will start syncing immediately after peer connection

// IMPORTANT: Use wss:// for WebSocket connections, not https://
gun.opt({peers: ['wss://example.com/gun']})  // ✅ Correct
gun.opt({peers: ['https://example.com/gun']}) // ❌ Won't connect

// Troubleshooting: If peers don't connect
// 1. Check peer format (must be wss:// for WebSockets)
gun.back('opt.peers')  // Should show: {url: "wss://...", ...}

// 2. Test WebSocket directly
const ws = new WebSocket('wss://example.com/gun')
ws.onopen = () => console.log('WebSocket works!')
ws.onerror = (e) => console.log('WebSocket error:', e)

// 3. Gun.js may not accept peers after initialization
// Consider reloading with peer in URL parameter (future feature)

// 4. Alternative: Create new Gun instance (experimental)
const gun2 = Gun({peers: ['wss://example.com/gun']})
```

## Technical Details

The debug logger:
- Stores last 100 events in memory
- Has zero impact when not activated
- Works in all modern browsers
- Automatically enabled in development mode
- Can be activated in production via URL parameters

## Tips

1. **Use filtered debugging** to reduce noise when tracking specific issues
2. **Silent mode** is useful for capturing logs without console spam
3. **Combine with browser DevTools** Network tab to see WebSocket traffic
4. **Memory monitoring** helps identify subscription leaks

## Implementation

The debug tools are implemented in:
- `client/src/utils/gunLogger.ts` - Core logger implementation
- `client/src/main.ts` - Integration point