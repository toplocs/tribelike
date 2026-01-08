# Environment Variables Setup

## Single Source of Truth

**For Development:** Edit `.env.development` only
**For Production:** Edit `.env` only

### Structure

```
.env                          # Production defaults (minimal)
.env.development             # Development config (EDIT THIS FOR DEV)
client/.env                  # Comment only (vars loaded from root)
client/vite.config.ts        # envDir: '..' (reads from root)
```

### Key Variables

**Most Important (change these for your setup):**
- `VITE_GUN_PEERS` - Gun relay WebSocket URL (default: `ws://localhost:3000/gun`)
- `VITE_APP_VERSION` - App version for data namespace (default: `0.5.7`)
- `PORT` - Server port (default: `3000`)

**Rarely Changed:**
- `RPID` - Hostname (default: `localhost`)
- `HTTPS` - Enable HTTPS (default: `false`)
- `VITE_GRAVATAR_URL` - Avatar service
- `PINATA_*` - IPFS upload service variables

## How It Works

1. **Development (`pnpm dev`):**
   - Load `.env.development`
   - Vite reads from root via `envDir: '..'` in `client/vite.config.ts`
   - Server and client both use same variables

2. **Production:**
   - Load `.env`
   - Minimal fallback values

## Example: Changing Gun Relay URL

Edit `.env.development`:
```diff
- VITE_GUN_PEERS=ws://localhost:3000/gun
+ VITE_GUN_PEERS=ws://your-domain.com/gun
```

Restart `pnpm dev` - both server and client use new URL automatically.

## No More Duplicates ✅

- Root `.env.development` = development config (SINGLE SOURCE)
- Client automatically reads from root via Vite config
- No duplicate variables scattered across files
- Clear separation: `.env` (prod) vs `.env.development` (dev)
