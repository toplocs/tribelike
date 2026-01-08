# Gun.js P2P Relay Setup - WORKING

## Files Modified

### Server (`server/src/gun.ts`)
```typescript
export function initGun(server: any) {
  gun = Gun({
    web: server,  // ✅ Attaches Gun relay to HTTP/HTTPS server
    peers: [],    // No external peers - relay local connections
  });
  return gun;
}
```
- Gun relay attached to Express HTTP server
- WebSocket upgrade handler at `/gun`
- Routes Gun protocol messages between peers

### Client (`client/src/services/gun.ts`)
```typescript
const gunConfig: any = {
  peers,  // Connects to VITE_GUN_PEERS=ws://localhost:3000/gun
  rad: true,
};
const gun = Gun(gunConfig);
const root = gun.get(`toplocs_v${APP_VERSION}`);

export { gun, APP_VERSION };
export default root;
```
- Exports `root` and `gun` for use in components
- Connects to relay via environment variable
- RAD indexing enabled

### Client Entry (`client/src/main.ts`)
```typescript
import root, { gun } from './services/gun';

// Expose to window for browser console debugging
(window as any).root = root;
(window as any).gun = gun;
```
- ✅ `root` accessible in browser console
- ✅ `gun` accessible in browser console

### Environment (`.env.development`)
```
VITE_GUN_PEERS=ws://localhost:3000/gun
```
- Client connects to relay at `ws://localhost:3000/gun`
- Express server on port 3000

### Root Package (`package.json`)
```json
"dev": "pnpm -F server dev & pnpm -F client dev"
```
- Starts Express server with Gun relay
- Starts Vite client development server

## How to Test P2P Synchronisation

### 1. Start Development Servers
```bash
pnpm dev
```

Expected server output:
```
🚀 HTTP Server ready at http://localhost:3000
⚡ Initializing Gun relay...
⚡ Gun relay initialised
🔫 Gun relay available at ws://localhost:3000/gun
Multicast on 233.255.255.255:8765
AXE relay enabled!
```

Expected client output (Vite):
```
VITE v7.0.0 ready in 689 ms
➜  Local: http://localhost:5173/
```

### 2. Open Two Browser Tabs
- Tab 1: `http://localhost:5173`
- Tab 2: `http://localhost:5173`

### 3. Test Data Sync from Browser Console

**In Tab 1 console:**
```javascript
root.get('test-sync').put({ message: 'Hello from Tab 1', timestamp: Date.now() })
```

**In Tab 2 console:**
```javascript
root.get('test-sync').on(data => {
  console.log('📡 Synced from Tab 1:', data)
})
```

✅ **Expected:** Tab 2 immediately receives data from Tab 1

### 4. Verify WebSocket Connection

In DevTools → Network:
1. Filter by "WS" (WebSocket)
2. Should see connection to `ws://localhost:3000/gun`
3. Status should be "101 Switching Protocols"
4. Green indicator = connected

## Architecture

```
┌─────────────────────────────────────────────────────┐
│ Browser Tab 1                  Browser Tab 2         │
│ ┌──────────────────┐         ┌──────────────────┐   │
│ │ root.get().put() │         │ root.get().on()  │   │
│ │  client/gun.ts   │         │  client/gun.ts   │   │
│ │ peers: [...]     │         │ peers: [...]     │   │
│ └────────┬─────────┘         └────────┬─────────┘   │
│          │ WebSocket                  │ WebSocket     │
│          └──────────────┬─────────────┘              │
│                         │ ws://localhost:3000/gun     │
└─────────────────────────┼──────────────────────────────┘
                          │
                          ▼
          ┌───────────────────────────────┐
          │  Express HTTP Server:3000     │
          │  Gun Relay (Gun({ web: ... }))│
          │  - Routes messages between    │
          │  - Manages peer discovery     │
          └───────────────────────────────┘
```

## Troubleshooting

### "Cannot access root in console"
- ✅ Fixed: main.ts now exposes `(window).root = root`
- Reload browser tab if you don't see it

### "Data not syncing between tabs"
1. Check WebSocket connection in DevTools → Network
2. Verify server is running: `ps aux | grep "ts-node\|nodemon"`
3. Check browser console for errors
4. Restart with: `pkill -f "pnpm dev"; pnpm dev`

### "WebSocket connection fails"
- Server might not have Gun relay attached
- Verify `server/src/gun.ts` has `web: server`
- Check that `initGun(server)` is called in `app.ts`

## Files to Remember

- `server/src/gun.ts` - Gun relay setup
- `server/src/app.ts` - Express + Gun initialization
- `client/src/services/gun.ts` - Client Gun config
- `client/src/main.ts` - Exposes root/gun to window
- `.env.development` - Environment variables
- `package.json` - Dev command setup
