# TopLocs TribeLike

TopLocs stands for topic- and location-based interests. TribeLike is a **decentralized P2P community platform** where you can meet likeminded people.

## 🚀 Architecture

TribeLike uses a **peer-to-peer architecture** powered by [Gun.js](https://gun.eco/):
- ✅ **No central server** - Express server only relays Gun.js messages between peers
- ✅ **Offline-first** - Works completely without internet (syncs when reconnected)
- ✅ **User-owned data** - All data stored locally in your browser
- ✅ **Real-time sync** - Changes propagate instantly between browser windows/tabs/devices
- ✅ **Verified P2P** - Gun relay configuration tested and working

For a detailed explanation of the P2P architecture, see the [centralized documentation](https://github.com/toplocs/toplocs-workspace/blob/main/docs/project/architecture.md).

## Tech Stack

- **Frontend**: Vue.js 3 with TypeScript
- **P2P Database**: Gun.js (distributed graph database)
- **Authentication**: WebAuthn/Passkeys + Gun SEA cryptography
- **Server**: Minimal Express relay with Gun.js WebSocket (`Gun({ web: server })`)
- **Styling**: TailwindCSS 4.x
- **Plugins**: Extensible plugin system with Module Federation

## Features

- **Multiple Profiles** - Work, Family, Friends contexts
- **Topics & Locations** - Find people by interests and places
- **Universal Relations** - Connect topics, locations or any entity
- **Plugins**:
  - Locations - Maps
  - 💬 Chat - Real-time messaging
  - 📅 Events - Event management
  - 📝 Wiki - Collaborative documentation

## Project Setup

Requirements:
- Node.js >= 20
- pnpm >= 3

```sh
# Install dependencies
pnpm install

# Build everything (client + server)
pnpm build

# Start the P2P relay server
cd server
pnpm dev
```

Open http://localhost:3000 in your browser.

## Development

```sh
# Run client and server in dev mode
pnpm dev

# Run tests
pnpm test

# Lint code
pnpm lint
```

## How it Works

1. The server (`/server`) is a Gun.js relay
2. Application logic runs in the browser
3. Data is stored in Gun's distributed graph database
4. Peers sync directly with each other
5. The server helps peers to discover each other

## Documentation

📚 **All comprehensive documentation is centralized in the workspace:**

👉 **[Complete Documentation Hub](https://github.com/toplocs/toplocs-workspace/tree/main/docs)**

### General TopLocs Documentation
- **[Getting Started](https://github.com/toplocs/toplocs-workspace/blob/main/docs/workspace/getting-started.md)** - AI-powered ecosystem setup
- **[Architecture](https://github.com/toplocs/toplocs-workspace/blob/main/docs/project/architecture.md)** - P2P architecture overview
- **[Plugin Development](https://github.com/toplocs/toplocs-workspace/blob/main/docs/development/plugin-development.md)** - How to create plugins
- **[Debug Guide](https://github.com/toplocs/toplocs-workspace/blob/main/docs/development/debug-guide.md)** - Debug tools and commands

### Tribelike-Specific Documentation
- **[Development Guide](./docs/DEVELOPMENT.md)** - Tribelike technical details, data architecture, and development patterns
- **[Debug Tools](./docs/DEBUG.md)** - Gun.js debug logging and monitoring tools

## New to TopLocs?

If you're a new developer, start with the **[Getting Started Guide](https://github.com/toplocs/toplocs-workspace/blob/main/docs/workspace/getting-started.md)** which includes:
- AI-powered complete ecosystem setup
- How to get shared Claude Code context
- Development environment configuration
- Contribution guidelines

## Contributing

Contributions are welcome! Please check out our [issues](https://github.com/toplocs/tribelike/issues) for areas where you can help.

## Open Source
MIT License. Feedback and contributions are welcome.
