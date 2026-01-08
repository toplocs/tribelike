# P2P Sync Testing Guide

## Setup
Run `pnpm dev` to start both the Gun relay server and Vite client.

```
🔫 Starting minimal Gun.js relay server...
✓ Gun relay server listening on http://localhost:3000
✓ WebSocket relay available at ws://localhost:3000/gun
```

Client connects to: `ws://localhost:3000/gun`

## Testing P2P Synchronisation

### Browser Console Test (Quick)

1. **Open two browser tabs** to `http://localhost:5173`
2. In **Tab 1** console, run:
```javascript
root.get('test-sync').put({ message: 'Hello from Tab 1', timestamp: Date.now() })
```

3. In **Tab 2** console, immediately run:
```javascript
root.get('test-sync').on(data => {
  console.log('📡 Received from relay:', data)
})
```

✅ **Expected:** Tab 2 should receive the data from Tab 1 in real-time

### How It Works

1. Both browser windows connect to the Gun relay via WebSocket
2. When Tab 1 writes data: `root.get('test-sync').put(...)`
3. Gun relay receives the message and broadcasts to all connected peers
4. Tab 2 listener receives the update via `.on()`
5. Data is stored in both browser's localStorage

### Troubleshooting

If data doesn't sync:

1. **Check server is running:**
   ```
   ps aux | grep gun-minimal
   ```

2. **Check browser console for connection logs:**
   ```
   🔫 Initializing Gun.js with peers: ['ws://localhost:3000/gun']
   ✓ Gun.js initialized
   ```

3. **Check WebSocket connection in DevTools:**
   - Open DevTools → Network → Filter by "WS"
   - Should see WebSocket connection to `ws://localhost:3000/gun`

4. **Verify relay is accepting connections:**
   - Server should show: `Multicast on 233.255.255.255:8765`
   - AXE relay enabled means efficient binary protocol is active
