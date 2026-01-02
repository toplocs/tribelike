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

### Comments System
- `commentProvider()`: Reddit-like comments with voting and nested replies
- Data structure:
  - `comment/{id}`: Primary comment storage (single source of truth)
  - `sphere/{sphereId}/comments/{id}`: Comment index for efficient querying
  - `comment/{parentId}/replies/{id}`: Nested reply structure
  - `vote/{id}`: Vote records for tallying
- Features:
  - Real-time comment loading with `.map().once()` listeners
  - Vote tallying and user vote tracking
  - Nested reply support
  - Automatic sync across peers
  - Full persistence to localStorage with Round-trip writes (`.put().once()`)

### Feed & Profile Discovery
- `feedProvider()`: Manages personal and global activity feeds
  - Personal feed: Comments from spheres user follows
  - Global feed: Recent comments from all spheres (for logged-out users)
- `BrowseProfilesView`: Profile discovery page at `/browse-profiles`
  - Shows all community profiles in a grid layout
  - Placeholder for future profile-to-profile relations feature
  - Works for both logged-in and logged-out users

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
- **Search**: `client/src/components/search/SphereSearch.vue` - Header search for discovering spheres

### Sphere Search Component

The `SphereSearch.vue` component provides real-time sphere discovery in the page header:

**Features:**
- Keyboard navigation (↑↓ arrows, Enter to select, Escape to close)
- Loading skeletons during Gun.js 600ms lookup
- Result cards with sphere metadata (title, description, member count)
- Dark mode support with proper focus states
- Click-outside-to-close functionality
- Clear button to reset search
- Mobile-responsive design

**Implementation Details:**
- Debounced input (300ms) to reduce Gun.js queries
- Uses `sphereProvider().searchSphereByTitle()` for lexicographic range queries
- Minimum 3 characters before search triggers
- Displays up to 10 results
- Auto-closes dropdown and clears search on sphere selection

**Known Limitations:**
- **Unicode characters** (e.g., "ü", "ö", "ñ") in sphere titles may not be found due to Gun.js lexicographic range query limitations. The `incrementLastChar()` utility function doesn't properly handle unicode charCodes. Workaround: search using base ASCII equivalents (e.g., "Nurnberg" instead of "Nürnberg") or use the first 3 ASCII characters of the name.
- **Search is case-insensitive** but relies on exact character matching after lowercasing

**Location in codebase:**
- Component: `client/src/components/search/SphereSearch.vue`
- Integration: `client/src/components/NavBar.vue` (line 23)
- Provider: `client/src/composables/sphereProvider.ts`
- Search logic: `sphereProvider().searchSphereByTitle(term, limit?)`

### Drag & Drop Relations
The relation system includes drag-and-drop functionality via FormKit:
- `client/src/components/dragdrop/` - Drag-and-drop components
- Relations can be visually reorganized and updated

### Routing & Public Pages
Key routes and navigation:
- `/` - Landing page (shows activity feed, publicly accessible)
- `/login` - Authentication page
- `/profiles` - User's own profile management (requires authentication)
- `/browse-profiles` - Profile discovery page showing all community members (public)
- `/profile/{id}` - View individual profile details
- `/sphere/{id}` - Community/discussion space
- Profile-to-profile relations will extend `/browse-profiles` to show filtered/recommended profiles based on user interests

### Testing
- Server tests in `server/tests/` using Vitest
- Workspace-based test configuration allows isolated testing
- Gun.js P2P features can be tested with multiple browser tabs

## 🔐 Authentication Flow

1. WebAuthn credential creation/verification
2. Derived Gun.js username/password from WebAuthn rawId
3. Gun user session with encrypted private data space

### State Clearing on Logout
When users logout, the application properly clears all authentication and profile state:
- `userProvider.logout()` clears user state and removes `profileId` from localStorage
- `profileProvider` watches authentication state and clears profile state when `isAuthenticated` becomes false
- This ensures that the frontpage displays "Stranger" instead of the previous user's name after logout

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