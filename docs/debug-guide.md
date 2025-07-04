# Tribelike Debug Guide

## Browser Console Commands

After starting the app in development mode (`pnpm dev`), these commands are available:

```javascript
// Show complete local graph
gunDebug.graph()

// Show connected peers
gunDebug.peers()

// Show current user
gunDebug.user()

// Monitor a specific path
gunDebug.watch('profile/123')
gunDebug.watch('relations')

// Show Gun data in localStorage
gunDebug.storage()

// Clear all Gun data (with confirmation)
gunDebug.clear()

// Direct Gun access
gun.get('profile/123').once(console.log)
```

## Browser DevTools Tips

### 1. Network Tab
- Filter: `WS` (WebSocket)
- Shows Gun.js peer connections
- Click on WebSocket → "Messages" tab

### 2. Application Tab
- Local Storage → Filter: `gun/`
- IndexedDB → `gun-rtc` Database
- Session Storage

### 3. Console Filter
Create custom filter for clean logs:
- Regex: `^(?!.*WebSocket).*$` (hides WebSocket errors)
- Or: `-WebSocket -failed` (hides specific words)

## Chrome Extensions

### Vue.js devtools
```bash
https://chrome.google.com/webstore/detail/vuejs-devtools
```
- Shows Vue Component Tree
- Inspect Gun-Provider States

### WebSocket Frame Inspector
For detailed WebSocket debugging

## Local Gun Relay with Logging

```javascript
// server/src/server.ts extension
Gun({ 
  web: server,
  axe: false, // Disables memory limits
  localStorage: false,
  radisk: false,
  multicast: false,
  stats: true, // Enables statistics
  log: function(msg) {
    console.log('GUN:', msg);
  }
});
```

## Common Debug Scenarios

### "User not found"
```javascript
// Check user
gunDebug.user()

// Clear if corrupted
gunDebug.clear()
```

### Sync Problems
```javascript
// Check peers
gunDebug.peers()

// Watch for updates
gunDebug.watch('profile/' + myId)
```

### Performance
```javascript
// Graph size
Object.keys(gunDebug.graph()).length

// Memory usage
console.log(performance.memory)
```

## Production Debugging

For production build with debug:

```javascript
// client/src/services/gun.ts
const DEBUG = new URLSearchParams(location.search).has('debug');
if (DEBUG) {
  import('./utils/gunDebug');
}
```

Then: `https://tribelike.shniq.dev?debug=true`