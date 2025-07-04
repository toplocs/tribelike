# TopLocs Architecture

## Overview

TopLocs is a **decentralized peer-to-peer community platform** built on Gun.js that connects people through shared interests and locations. The architecture is designed around the principle of user data ownership and decentralized storage.

## Core Principles

- **No Central Authority**: No single server controls the data
- **User-Owned Data**: Users control their own data through cryptographic keys  
- **Offline-First**: The app works without internet connectivity
- **Real-Time Sync**: Changes propagate instantly between connected peers
- **Local-First**: Data is stored locally before being shared

## Technology Stack

### Client
- **Vue.js 3**: Progressive web framework
- **TypeScript**: Type safety and developer experience
- **Gun.js**: Distributed graph database for data persistence
- **TailwindCSS 4.x**: Utility-first styling
- **Vite**: Build tool and development server

### Server
- **Node.js + Express**: Minimal server (26 lines!)
- **Gun.js**: Serves only as Gun.js relay for peer discovery
- **No traditional database**: All data is stored in Gun.js graph

### Authentication
- **WebAuthn (Passkeys)**: Modern, secure authentication
- **Gun SEA**: Cryptographic layer for data encryption
- **Derived credentials**: Gun.js username/password derived from WebAuthn rawId

### Testing
- **Vitest**: Workspace configuration for testing
- **Multi-tab testing**: Gun.js P2P features tested with multiple browser tabs

## Data Architecture

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

## Component Architecture

### Key Composables & Providers

#### User Management
- `userProvider()`: WebAuthn authentication + Gun user management
- `profileProvider()`: User profile creation and management

#### Entity Providers  
- `sphereProvider()`: Sphere (community) management with local/global spaces
- `topicProvider()`: Topic management 
- `locationProvider()`: Geographic location management
- `relationProvider()`: Universal relation system for connecting entities
- `pluginProvider()`: Dynamic plugin loading and management

#### Gun.js Integration
- `client/src/services/gun.ts`: Gun.js configuration with custom methods
- `server/src/gun.ts`: Server-side Gun relay initialization

## Plugin Architecture

Plugins extend functionality without modifying core code:
- Plugins are registered in Gun at `gun.get('plugins')`
- Support dynamic routes, UI tabs, and component slots
- Example plugins: chat, wiki, events
- Plugin management UI available in profile settings

### Module Federation
The plugin system uses **Webpack Module Federation** for runtime plugin loading:

```typescript
// Plugin Configuration
federation({
  name: 'plugin-name',
  filename: 'plugin.js',
  exposes: {
    './ComponentName': './src/components/ComponentName.vue'
  },
  shared: ['vue', 'tailwindcss']
})
```

### Plugin Integration Points
1. **Main Content Area**: Full-page plugin components
2. **Sidebar**: Navigation and quick access components  
3. **Settings**: Configuration interfaces
4. **Modal/Dialog**: Overlay interactions

## Authentication Flow

1. **WebAuthn credential creation/verification**
2. **Derived Gun.js username/password from WebAuthn rawId**
3. **Gun user session with encrypted private data space**

## Data Persistence  

- All business logic runs in the browser
- Server only facilitates peer discovery (Gun relay)
- Data syncs automatically between connected peers
- Works offline with local Gun.js storage

## Environment Variables

- `VITE_GUN_PEERS`: Comma-separated list of Gun relay peers for client
- Server configuration in `server/src/config.ts`

## Development Architecture

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

## Migration Status

The codebase is currently transitioning from a traditional server architecture to the P2P Gun.js architecture. Several feature branches are in progress to complete this migration (relation provider, sphere system, plugin system, etc.).