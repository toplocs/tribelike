# Tribelike Development Guide

This document contains tribelike-specific development information and technical details.

## 🏗️ Architecture Overview

Tribelike is a **decentralized peer-to-peer (P2P) community platform** built on Gun.js. This is fundamentally different from traditional client-server architectures:

### Core Principles
- **No Central Authority**: No single server controls the data
- **User-Owned Data**: Users control their own data through cryptographic keys  
- **Offline-First**: The app works without internet connectivity
- **Real-Time Sync**: Changes propagate instantly between connected peers
- **Local-First**: Data is stored locally before being shared

### Technology Stack
- **Client**: Vue.js 3 + TypeScript with Gun.js for data persistence
- **Server**: Minimal Express server serving only as Gun.js relay (26 lines!)
- **Database**: Gun.js distributed graph database (no traditional database)
- **Authentication**: WebAuthn (Passkeys) + Gun SEA cryptography
- **Styling**: TailwindCSS 4.x
- **Testing**: Vitest workspace configuration

## 📊 Data Architecture

### Gun.js Graph Database
All data is stored in a distributed graph where each node can reference other nodes. Data is content-addressed and cryptographically signed.

### Key Data Namespaces
```javascript
gun.get('credentials').get(email)         // Authentication
gun.get('profile/{id}')                   // User profiles  
gun.get('location/{id}')                  // Geographic locations
gun.get('topic/{id}/{space}')            // Topics with space concept
gun.get('sphere/{id}/{space}')           // Community spheres
gun.get('relations/{from}/{type}/{to}')  // Universal relations
gun.get('plugins')                        // Plugin registry
```

### Space Concept
Topics and Spheres implement a "space" concept for progressive disclosure:
- **Local space**: Private to creator (`topic/123/local`)
- **Global space**: Published publicly (`topic/123/global`)

### Universal Relations System
Relations connect any two entities with typed relationships defined in `client/src/assets/relationKeys.ts`. Relations are bidirectional and include:
- Profile relations (like, love, learn, teach, visit, live, going, work)
- Topic relations (child, category)
- Location relations (child, category)

## 🔧 Key Composables & Providers

### User Management
- `userProvider()`: WebAuthn authentication + Gun user management
- `profileProvider()`: User profile creation and management

### Entity Providers  
- `sphereProvider()`: Sphere (community) management with local/global spaces
- `topicProvider()`: Topic management 
- `locationProvider()`: Geographic location management
- `relationProvider()`: Universal relation system for connecting entities
- `pluginProvider()`: Dynamic plugin loading and management

### Gun.js Integration
- `client/src/services/gun.ts`: Gun.js configuration with custom methods
- `server/src/gun.ts`: Server-side Gun relay initialization

## 🔌 Plugin Architecture

Plugins extend functionality without modifying core code:
- Plugins are registered in Gun at `gun.get('plugins')`
- Support dynamic routes, UI tabs, and component slots
- Example plugins: chat, wiki, events
- Plugin management UI available in profile settings

## 🏗️ Development Patterns

### Component Structure
- **Common components**: `client/src/components/common/` - Reusable UI primitives
- **Forms**: `client/src/components/forms/` - Entity creation/editing forms  
- **Views**: `client/src/views/` - Full page components organized by entity type
- **Badges**: `client/src/components/badges/` - Entity display components

### Drag & Drop Relations
The relation system includes drag-and-drop functionality via FormKit:
- `client/src/components/dragdrop/` - Drag-and-drop components
- Relations can be visually reorganized and updated

### Testing
- Server tests in `server/tests/` using Vitest
- Workspace-based test configuration allows isolated testing
- Gun.js P2P features can be tested with multiple browser tabs

## 🔐 Authentication Flow

1. WebAuthn credential creation/verification
2. Derived Gun.js username/password from WebAuthn rawId
3. Gun user session with encrypted private data space

## 💾 Data Persistence  

- All business logic runs in the browser
- Server only facilitates peer discovery (Gun relay)
- Data syncs automatically between connected peers
- Works offline with local Gun.js storage

## ⚙️ Environment Variables

- `VITE_GUN_PEERS`: Comma-separated list of Gun relay peers for client
- Server configuration in `server/src/config.ts`

## 🚧 Migration Status

The codebase is currently transitioning from a traditional server architecture to the P2P Gun.js architecture. Several feature branches are in progress to complete this migration (relation provider, sphere system, plugin system, etc.).

## 💻 Development Commands

### Development
```bash
# Start development environment (client + server)
pnpm dev

# Start with HTTPS (requires certificates)
pnpm dev:https

# Build all workspaces
pnpm build

# Run tests across all workspaces
pnpm test

# Run linting across all workspaces
pnpm lint

# Type checking across all workspaces  
pnpm check
```

### Single Test Execution
```bash
# Run tests for specific workspace
pnpm -F client test
pnpm -F server test

# Run vitest in development mode
pnpm vitest dev

# Run vitest with UI
pnpm vitest --ui
```

### Server-specific Commands
```bash
# Clear Gun.js session data
pnpm clear

# Generate SSL certificates for HTTPS
pnpm certs

# Generate OpenAPI documentation
pnpm generate:openapi
```