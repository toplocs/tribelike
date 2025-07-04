# TopLocs Ecosystem Overview

This document provides a high-level overview of the entire TopLocs ecosystem, including all repositories and their relationships.

## Repository Overview

TopLocs is organized as a collection of independent repositories that work together to create a decentralized community platform:

```
toplocs/ (workspace folder)
├── 🏛️  Core Platform
│   ├── tribelike/           # Main community platform & plugin host
│   ├── locations/           # Location-based mobile app (Ionic)
│   └── tribelike.wiki/      # Documentation wiki
├── 🔌 Plugin Ecosystem
│   ├── event-plugin/        # Plugin: Real-time chat & event management
│   ├── wiki-plugin/         # Plugin: Knowledge sharing & documentation
│   ├── location-plugin/     # Plugin: Location management & mapping
│   └── link-plugin/         # Plugin: Link sharing & bookmarking
├── 🔬 Proof of Concepts & Technology Tests
│   ├── gun-sign/            # PoC: Gun.js server with custom storage
│   ├── gun-playground/      # PoC: Gun.js development environment
│   ├── decentral-auth/      # PoC: WebAuthn + Gun.js authentication
│   └── project-playground/  # PoC: Architecture testing & patterns
├── 🛠️  Development Tools
│   └── demo-plugin/         # Plugin development framework
└── 📋 Project Management
    └── Funding/             # Grant applications & funding docs
```

## Core Architecture

TopLocs (Topic + Location) is a **decentralized peer-to-peer community platform** built on Gun.js:

### Key Principles
- **No Central Authority**: No single server controls the data
- **User-Owned Data**: Users control their data through cryptographic keys
- **Offline-First**: Works without internet connectivity
- **Real-Time Sync**: Changes propagate instantly between connected peers
- **Plugin-Based**: Extensible through Module Federation

### Technology Stack
- **Frontend**: Vue.js 3 + TypeScript + Gun.js
- **Backend**: Minimal Express relay (Gun.js only)
- **Authentication**: WebAuthn/Passkeys + Gun SEA
- **Plugins**: Module Federation for dynamic loading
- **Mobile**: Ionic + Capacitor for native apps

## Repository Categories

### 🏛️ Production Repositories
These are the main repositories for the production platform:

- **tribelike** - Core community platform and plugin host
- **locations** - Mobile application for location-based interactions
- **tribelike.wiki** - Project documentation and specifications

### 🔌 Plugin Repositories
All repositories ending in `-plugin` are plugins for the platform:

- **event-plugin** - Real-time chat and event management
- **wiki-plugin** - Collaborative knowledge sharing
- **location-plugin** - Location management and mapping
- **link-plugin** - Link sharing and bookmarking

### 🔬 Proof of Concept Repositories
These repositories contain technology tests and experimental implementations:

- **gun-sign** - Gun.js server with custom storage implementation
- **gun-playground** - Development environment for testing Gun.js features
- **decentral-auth** - WebAuthn + Gun.js authentication system
- **project-playground** - Architecture patterns and service abstractions

### 🛠️ Development Tools
- **demo-plugin** - Template and framework for plugin development

## Plugin Architecture

The platform uses **Module Federation** to load plugins dynamically:

```typescript
// Plugin configuration
federation({
  name: 'your-plugin',
  filename: 'plugin.js',
  exposes: {
    './Main': './src/components/Main.vue',
    './Settings': './src/components/Settings.vue'
  },
  shared: ['vue', 'tailwindcss']
})
```

Plugins integrate through:
1. **Gun.js shared data layer** - All plugins access the same decentralized database
2. **Component federation** - Runtime loading without rebuilding core
3. **Standard interfaces** - Main, Settings, Sidebar components
4. **Universal relations** - Connect any entities through typed relationships

## Data Architecture

### Gun.js Namespaces
```javascript
gun.get('credentials').get(email)         // Authentication
gun.get('profile/{id}')                   // User profiles
gun.get('location/{id}')                  // Geographic locations
gun.get('topic/{id}/{space}')            // Topics (local/global)
gun.get('sphere/{id}/{space}')           // Community spheres
gun.get('relations/{from}/{type}/{to}')  // Universal relations
gun.get('plugins')                        // Plugin registry
```

### Relationship System
- **Profile-Interest**: `favorite`, `doing`, `expert`, `learning`, `curious`
- **Profile-Location**: `living`, `working`, `traveling`, `visiting`, `current`
- **Profile-Profile**: `following`, `friend`, `family`, `partner`
- **Content relationships**: Categories, tags, hierarchies

## Development Workflow

### 1. Core Platform Development
```bash
cd tribelike
pnpm install
pnpm dev  # Starts client and server
```

### 2. Plugin Development
```bash
cd demo-plugin
pnpm install
pnpm dev  # Starts plugin development environment
```

### 3. Mobile Development
```bash
cd locations
npm install
npm run dev  # Web development
ionic cap run ios  # Native iOS
```

### 4. PoC/Testing
```bash
cd gun-playground  # or other PoC repos
pnpm install
pnpm dev
```

## Repository Relationships

### Data Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Plugins   │◄──►│  tribelike  │◄──►│  locations  │
│ (federated) │    │  (core)     │    │  (mobile)   │
└─────────────┘    └─────────────┘    └─────────────┘
      ▲                    ▲                    ▲
      │                    │                    │
      └────────────────────┼────────────────────┘
                           ▼
                   ┌─────────────┐
                   │   Gun.js    │
                   │ (P2P data)  │
                   └─────────────┘
```

### Development Dependencies
- **Plugins** depend on tribelike for core types and components
- **demo-plugin** provides templates for all plugin development
- **PoC repos** test technologies that may be integrated into core
- **locations** is independent but may integrate with core platform

## Getting Started

### For Core Development
1. Start with **tribelike** - the main platform
2. Follow `tribelike/CLAUDE.md` for detailed guidance
3. Use `tribelike/docs/` for comprehensive documentation

### For Plugin Development
1. Use **demo-plugin** as your starting template
2. Follow the plugin development guide in `tribelike/docs/plugin-development.md`
3. Test integration with the demo framework

### For Mobile Development
1. Work in **locations** repository
2. Use Ionic/Capacitor for cross-platform development
3. Consider integration points with the core platform

### For Research/Testing
1. Use **PoC repositories** for experimentation
2. Test new technologies before integrating into core
3. Document findings for potential integration

## Documentation Structure

### Central Documentation
- **tribelike/docs/** - Complete ecosystem documentation
- **tribelike/CLAUDE.md** - AI development context
- **tribelike/README.md** - Core platform overview

### Repository-Specific Documentation
- Each repository has its own README.md
- Plugin repositories link back to central docs
- PoC repositories document experimental findings

## Maintenance Strategy

### Documentation Updates
1. **Primary**: Update tribelike/docs/ for ecosystem changes
2. **Secondary**: Update individual repository READMEs
3. **Links**: Maintain cross-references between repositories

### Version Management
- Each repository is independently versioned
- Plugin compatibility is managed through shared interfaces
- Core platform changes may require plugin updates

## Contributing

1. **Understand the ecosystem** - Review this document and tribelike/docs/
2. **Choose your area** - Core platform, plugins, mobile, or research
3. **Follow the patterns** - Use existing repositories as guides
4. **Test thoroughly** - Use appropriate development environments
5. **Document changes** - Update relevant documentation

This ecosystem approach allows for:
- **Independent development** of different components
- **Flexible deployment** of only needed parts
- **Experimental features** without affecting core stability
- **Community contributions** through the plugin system