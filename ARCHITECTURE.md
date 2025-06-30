# Tribelike Architecture

## Overview

Tribelike is a **decentralized peer-to-peer (P2P) community platform** built on [Gun.js](https://gun.eco/). Unlike traditional client-server architectures, Tribelike operates without a central backend, database, or authentication server. All logic runs in the browser, and data is synchronized across peers using Gun's distributed graph database.

## Core Principles

1. **No Central Authority**: No single server controls the data
2. **User-Owned Data**: Users control their own data through cryptographic keys
3. **Offline-First**: The app works without internet connectivity
4. **Real-Time Sync**: Changes propagate instantly between connected peers
5. **Local-First**: Data is stored locally before being shared

## System Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Browser Peer   │────▶│   Gun Relay     │◀────│  Browser Peer   │
│  (Vue.js App)   │     │  (26 lines!)    │     │  (Vue.js App)   │
│                 │     │                 │     │                 │
└────────┬────────┘     └─────────────────┘     └────────┬────────┘
         │                                                 │
         │              Direct P2P Connection              │
         └─────────────────────────────────────────────────┘
```

### Components

1. **Browser Client** (`/client`)
   - Vue.js 3 application with TypeScript
   - Contains ALL business logic
   - Manages Gun.js connections
   - Handles WebAuthn authentication
   - Stores data locally in Gun

2. **Gun Relay Server** (`/server`)
   - Minimal Express server (26 lines of code!)
   - Only purpose: Help peers discover each other
   - No business logic, no data storage
   - Optional - peers can connect directly

3. **Shared Types** (`/types`)
   - TypeScript definitions used by both client and server
   - Ensures type safety across the codebase

## Data Architecture

### Gun.js Graph Database

Gun.js stores data as a distributed graph where each node can reference other nodes. Data is content-addressed and cryptographically signed.

```javascript
// Data is organized in a graph structure
gun.get('profile/123').put({
  name: 'Alice',
  avatar: 'https://...',
  interests: gun.get('profile/123/interests')
})
```

### Data Namespaces

```
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

```javascript
// Local space - only visible to creator
gun.get('topic/123/local').put({ title: 'My Draft Topic' })

// Global space - published for everyone
gun.get('topic/123/global').put({ title: 'My Published Topic' })
```

This allows users to work on content privately before publishing.

### Universal Relations System

Relations connect any two entities in the system:

```javascript
// User likes a topic
gun.get('relations/profile:alice/likes/topic:javascript')

// Topic belongs to location
gun.get('relations/topic:hiking/at/location:denver')

// User follows another user
gun.get('relations/profile:alice/follows/profile:bob')
```

Relations are bidirectional and can be traversed from either end.

## Authentication Architecture

### WebAuthn + Gun SEA

Authentication uses a combination of WebAuthn (Passkeys) and Gun's Security, Encryption, and Authorization (SEA) library:

1. **Registration**:
   ```javascript
   // Create WebAuthn credential
   const credential = await navigator.credentials.create({...})
   
   // Store in Gun
   gun.get('credentials').get(email).put({
     credentialId: credential.id,
     publicKey: credential.publicKey
   })
   ```

2. **Login**:
   ```javascript
   // Verify WebAuthn
   const assertion = await navigator.credentials.get({...})
   
   // Create Gun user session
   gun.user().auth(alias, pass)
   ```

3. **User Space**:
   ```javascript
   // Private data only accessible by user
   gun.user().get('private').put(sensitiveData)
   ```

## Plugin Architecture

Plugins extend Tribelike's functionality without modifying core code:

### Plugin Structure
```javascript
{
  id: 'chat',
  name: 'Chat Plugin',
  version: '1.0.0',
  routes: [
    { path: '/chat', component: 'ChatView' }
  ],
  tabs: [
    { id: 'messages', label: 'Messages', component: 'MessagesTab' }
  ],
  slots: {
    'profile.header': 'ProfileChatButton'
  }
}
```

### Plugin Loading
1. Plugins are registered in Gun at `gun.get('plugins')`
2. Client dynamically loads plugin components
3. Vue Router is updated with plugin routes
4. UI slots are populated with plugin components

### Built-in Plugins
- **Chat**: Real-time messaging between users
- **Wiki**: Collaborative documentation
- **Events**: Event planning and management

## Data Flow

### Write Flow
```
User Action → Vue Component → Composable → Gun.put() → Local Storage
                                              ↓
                                         P2P Network → Other Peers
```

### Read Flow
```
Gun.on() → Composable → Reactive State → Vue Component → UI Update
   ↑                                           
P2P Network (real-time updates)
```

### Offline Sync
1. Changes are always written locally first
2. When online, Gun syncs with connected peers
3. Conflict resolution uses "last write wins" by default
4. Custom conflict resolution can be implemented

## Security Model

### Data Privacy
- **Public Data**: Stored in shared namespaces (profiles, topics)
- **Private Data**: Stored in user's encrypted space
- **Shared Data**: Encrypted with group keys

### Trust Model
- Users trust their own device (local-first)
- Data is cryptographically signed
- Peers verify signatures before accepting data
- No central authority to trust

## Performance Considerations

### Scalability
- Horizontal scaling through more peers
- No central bottleneck
- Data sharding happens naturally

### Optimization Strategies
1. **Lazy Loading**: Only load data when needed
2. **Pagination**: Use Gun's lexical ordering
3. **Caching**: Gun handles caching automatically
4. **Indexes**: Create custom indexes for queries

```javascript
// Example: Title index for fast searching
gun.get('spheres/titles').get('blockchain').set(sphere)
```

## Development Workflow

### Local Development
1. Start Gun relay: `cd server && pnpm dev`
2. Gun serves as WebSocket relay
3. Multiple browser tabs can act as different peers
4. Data persists in browser localStorage

### Testing P2P Features
1. Open multiple browser windows
2. Use different profiles in each
3. Verify real-time sync
4. Test offline mode by killing relay

### Debugging
```javascript
// View Gun's internal graph
gun._.graph

// Monitor Gun events
gun._.on('in', (msg) => console.log('Received:', msg))
gun._.on('out', (msg) => console.log('Sent:', msg))
```

## Conclusion

Tribelike's P2P architecture represents a fundamental shift in how web applications are built. By eliminating the central server and embracing local-first principles, we create a more resilient, private, and user-controlled platform. The architecture may seem unusual to developers familiar with traditional client-server models, but it offers significant advantages for building truly decentralized communities.