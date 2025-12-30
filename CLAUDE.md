# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🏗️ Project Overview

**TribeLike** is a decentralised peer-to-peer (P2P) community platform built on Gun.js. It enables users to discover and connect with like-minded people based on topics, locations, and shared interests. The architecture fundamentally differs from traditional client-server applications—no central authority controls data, and users own their information through cryptographic keys.

### Core Tech Stack
- **Frontend**: Vue.js 3 + TypeScript with Vite
- **P2P Database**: Gun.js (distributed graph database)
- **Authentication**: WebAuthn (passkeys) + Gun SEA cryptography
- **Server**: Minimal Express relay (26 lines!)
- **Styling**: TailwindCSS 4.x
- **Testing**: Vitest with workspace configuration
- **Package Manager**: pnpm workspaces (Node.js ≥20, pnpm ≥3)

### Repository Structure
```
/client         - Vue.js 3 frontend application
  /src
    /components - UI components (common, forms, dragdrop, badges, views)
    /composables - Reusable logic providers
    /services   - Gun.js configuration and integrations
    /views      - Full page components
    /router     - Vue Router configuration
    /utils      - Utility functions (including Gun logger)
    /assets     - Static assets and relation keys

/server         - Express relay server + Gun.js setup
  /src
    /app.ts     - Express server setup
    /config.ts  - Configuration management
    /gun.ts     - Gun.js relay initialisation
    /api        - API endpoints
    /actions    - Server-side actions
    /views      - HTML templates
    /data       - Gun.js session storage

/types          - Shared TypeScript type definitions

Root
  /docs         - Project documentation
  /package.json - Monorepo root configuration
```

## 🎯 Key Architectural Concepts

### P2P Architecture
- **No central server authority** - Each peer is independent
- **Local-first data** - All data stored locally before sharing
- **Offline-first** - Application works without internet
- **Real-time sync** - Changes propagate instantly between peers
- **Graph database** - Gun.js uses a distributed graph model

### Gun.js Data Namespaces
```javascript
gun.get('credentials').get(email)         // Authentication credentials
gun.get('profile/{id}')                   // User profile data
gun.get('location/{id}')                  // Geographic locations
gun.get('topic/{id}/{space}')            // Topics (local/global space)
gun.get('sphere/{id}/{space}')           // Community spheres
gun.get('relations/{from}/{type}/{to}')  // Universal relations system
gun.get('plugins')                        // Plugin registry
```

### Space Concept
Topics and Spheres use a space model for progressive disclosure:
- **Local space** (`/local`) - Private, visible only to creator
- **Global space** (`/global`) - Published publicly for discovery

### Universal Relations System
The relation system (`client/src/assets/relationKeys.ts`) defines typed bidirectional connections between any entities:
- Profile relations: `like`, `love`, `learn`, `teach`, `visit`, `live`, `going`, `work`
- Topic relations: `child`, `category`
- Location relations: `child`, `category`

## 🔧 Essential Composables & Providers

Core Vue composables that manage application state:

- **`userProvider()`** - WebAuthn authentication, Gun user session management
- **`profileProvider()`** - User profile creation and updates
- **`sphereProvider()`** - Sphere (community) management with local/global spaces
- **`topicProvider()`** - Topic creation and management
- **`locationProvider()`** - Geographic location management
- **`relationProvider()`** - Universal relation creation and queries
- **`pluginProvider()`** - Dynamic plugin loading and lifecycle

All providers are composables located in `client/src/composables/`.

## 🔌 Plugin Architecture

Plugins extend functionality without modifying core code:
- Registered in Gun at `gun.get('plugins')`
- Support dynamic routes, UI tabs, and component slots
- Built with Module Federation for code splitting
- Example plugins: Chat, Wiki, Events, Location

## 💾 Development Commands

### Common Development Tasks

```bash
# Start development environment (client + server in parallel)
pnpm dev

# Start with HTTPS (requires certificates)
pnpm dev:https

# Build all workspaces
pnpm build

# Run all tests (Vitest development mode, runs once)
pnpm test

# Run tests in interactive watch mode
pnpm vitest dev

# Run tests with visual UI
pnpm vitest --ui

# Type checking across all workspaces
pnpm check

# Lint and fix code across all workspaces
pnpm lint
```

### Single Workspace Commands

```bash
# Run tests for specific workspace
pnpm -F client test
pnpm -F server test

# Run client development server
pnpm -F client dev

# Run server development server
pnpm -F server dev

# Build specific workspace
pnpm -F client build
pnpm -F server build
```

### Server-Specific Commands

```bash
# Clear Gun.js session data (removes /server/data/sessions/*)
pnpm clear

# Generate SSL certificates for HTTPS development
pnpm certs

# Start production server
pnpm start

# Generate OpenAPI documentation
pnpm generate:openapi
```

## 🧪 Testing

Testing infrastructure uses Vitest across a workspace configuration:

- **Root config** (`vitest.config.ts`) - Caches at `.cache/`
- **Workspace tests** - Each workspace has its own test setup
- Tests run with `pnpm test` (runs once in CI mode)
- Interactive mode: `pnpm vitest dev` or `pnpm vitest --ui`
- Run specific workspace tests: `pnpm -F client test` or `pnpm -F server test`

### Testing Tip for P2P Features
Open multiple browser tabs to test peer-to-peer functionality—this simulates real P2P scenarios where multiple clients sync data.

## 🐛 Debugging Gun.js

The application includes comprehensive Gun.js debugging tools. See `docs/DEBUG.md` for detailed information.

### Quick Debug Commands
```javascript
gunStats()       // Show statistics and memory usage
gunRecent()      // Show last 10 events
gunGraph()       // Inspect local graph structure
gunStorage()     // Check Gun data in localStorage
gunWatch('path') // Monitor specific data paths
gun              // Direct Gun.js instance access
```

### URL-Based Debug Activation
Add query parameters to enable debugging in production:
```
?debug=true      // Full debug logging
?debug=peer      // Only peer connection events
?debug=get,put   // Multiple types (comma-separated)
?debug=silent    // Logger active, no console output
```

**Important for hash routing**: Query parameters must come BEFORE the hash:
- ✅ Correct: `https://example.com?debug=true#/login`
- ❌ Wrong: `https://example.com#/login?debug=true`

## 🌍 Data Flow & Persistence

1. **Browser Application** - All business logic runs in the browser
2. **Local Gun.js Store** - Data persists locally before sharing
3. **P2P Sync** - Changes automatically sync between connected peers
4. **Express Relay** - Server only facilitates peer discovery (not data authority)
5. **Offline Capability** - Application continues working without connectivity

## 🔐 Authentication

WebAuthn-based authentication with Gun.js:

1. User creates WebAuthn credential (passkey)
2. Credential's `rawId` is derived into Gun username/password
3. Gun user session manages encrypted private data space
4. No passwords stored—only cryptographic credentials

## 🚀 Current Migration Status

The codebase is transitioning from traditional server architecture to P2P architecture. This is reflected in the `feat/gun-versions` branch and related feature branches that complete the P2P migration.

## 📚 External Resources

Key documentation beyond this repository:

- **[Centralized Workspace Docs](https://github.com/toplocs/toplocs-workspace/tree/main/docs)** - All comprehensive TopLocs documentation
- **[Architecture Guide](https://github.com/toplocs/toplocs-workspace/blob/main/docs/project/architecture.md)** - P2P architecture details
- **[Plugin Development](https://github.com/toplocs/toplocs-workspace/blob/main/docs/development/plugin-development.md)** - How to create plugins
- **[Gun.js Docs](https://gun.eco/docs/)** - Core P2P database documentation
- **[Vue.js Guide](https://vuejs.org/guide/)** - Frontend framework
- **[WebAuthn Guide](https://webauthn.guide/)** - Modern authentication standard
- **[Module Federation](https://module-federation.github.io/)** - Plugin system architecture

## 🏛️ Tribelike-Specific Documentation

Within this repository:
- `docs/DEVELOPMENT.md` - Detailed development patterns and data architecture
- `docs/BEST-PRACTISES.md` - Development best practices, Gun.js patterns, and code standards
- `docs/DESIGN.md` - Design system, UX patterns, and visual guidelines
- `docs/DEBUG.md` - Gun.js debugging tools and techniques
- `README.md` - Project setup and overview

## ✅ Important Patterns

### Component Organization
- **Common components** (`client/src/components/common/`) - Reusable UI primitives
- **Forms** (`client/src/components/forms/`) - Entity creation/editing
- **Views** (`client/src/views/`) - Full page components
- **Badges** (`client/src/components/badges/`) - Entity display components
- **Drag-and-drop** (`client/src/components/dragdrop/`) - Relation visual management

### Composable Usage Pattern
```typescript
// Import and use a provider
import { userProvider } from '@/composables/userProvider'

export default {
  setup() {
    const { user, login, logout } = userProvider()
    return { user, login, logout }
  }
}
```

### Gun.js Data Access
```typescript
// Standard Gun.js access pattern
gun.get('profile/123').on(data => {
  // Handle data
})

// Using subscriptions
gun.get('relations').map().on(relation => {
  // Handle each relation
})
```

## 🚨 Critical Rules

1. **Use British English spelling** in all code and documentation
2. **Don't leave dev servers running** - Always close `pnpm dev` after work
3. **Preserve P2P functionality** - Maintain offline-first capabilities when modifying
4. **Test with multiple browser tabs** for P2P features to simulate real peer scenarios
5. **Use composables, not direct Gun calls** where possible for consistency
