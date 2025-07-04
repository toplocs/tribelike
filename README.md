# TopLocs TribeLike

TopLocs stands for topic- and location-based interests. TribeLike is a **decentralized P2P community platform** where you can meet likeminded people.

## 🚀 Architecture

TribeLike uses a **peer-to-peer architecture** powered by [Gun.js](https://gun.eco/):
- **No central server** - Just a minimal relay for P2P communication
- **Offline-first** - Works without internet connection
- **User-owned data** - Your data stays with you
- **Real-time sync** - Changes propagate instantly between peers

For a detailed explanation of the P2P architecture, see [docs/architecture.md](./docs/architecture.md).

## Tech Stack

- **Frontend**: Vue.js 3 with TypeScript
- **P2P Database**: Gun.js
- **Authentication**: WebAuthn/Passkeys + Gun SEA
- **Server**: Minimal Express relay (26 lines of code!)
- **Plugins**: Extensible plugin system

## Features

- **Multiple Profiles** - Work, Family, Friends contexts
- **Topics & Locations** - Find people by interests and places
- **Universal Relations** - Connect any entities together
- **Built-in Plugins**:
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

1. The server (`/server`) is just a Gun.js relay
2. All application logic runs in the browser
3. Data is stored in Gun's distributed graph database
4. Peers sync directly with each other
5. The server only helps peers discover each other

## Documentation

- [Architecture](./docs/architecture.md) - P2P architecture overview
- [Plugin Development](./docs/plugin-development.md) - How to create plugins
- [Debug Guide](./docs/debug-guide.md) - Debug tools and commands
- [Debug Tools](./docs/debug-tools.md) - Debug tools implementation

## Contributing

Contributions are welcome! Please check out our [issues](https://github.com/toplocs/tribelike/issues) for areas where you can help.

## Open Source
MIT License. Feedback and contributions are welcome.
