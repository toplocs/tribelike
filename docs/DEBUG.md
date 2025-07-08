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

### Filtered Debugging
Debug specific Gun.js operations:
- `?debug=peer` - Only peer connections
- `?debug=get` - Only GET operations
- `?debug=put` - Only PUT operations
- `?debug=subscribe` - Only subscriptions
- `?debug=get,put` - Multiple types (comma-separated)

### Examples
```bash
# Full debug
https://example.com?debug=true

# Only peer connections, no hints
https://example.com?debug=peer&quiet

# Silent mode (logs stored but not displayed)
https://example.com?debug=silent
```

## Console Commands

The Gun.js logger provides these global commands:

```javascript
gunStats()     // Show current statistics
gunRecent()    // Show last 10 events
gunRecent(20)  // Show last 20 events
gunClear()     // Clear log history
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
gunRecent()  // Shows recent activity

// Then trigger an action in the app and run again:
gunRecent()  // See what Gun.js operations happened
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