# TopLocs Documentation

Welcome to the TopLocs ecosystem documentation. This directory contains comprehensive guides for developers working with the TopLocs decentralized community platform.

## 📚 Documentation Overview

### Core Documentation
- **[Getting Started](./getting-started.md)** - Complete setup guide for new developers and Claude Code context
- **[Ecosystem Overview](./ecosystem.md)** - Complete overview of all TopLocs repositories and relationships
- **[Architecture](./architecture.md)** - Complete P2P architecture overview, Gun.js integration, and data structures
- **[Plugin Development](./plugin-development.md)** - Comprehensive guide for creating plugins with Module Federation

### Development Tools
- **[Debug Guide](./debug-guide.md)** - Browser console commands and debugging techniques
- **[Debug Tools](./debug-tools.md)** - Implementation guide for debug tools and monitoring

## 🏗️ Architecture Quick Reference

TopLocs is built on a **peer-to-peer architecture** using Gun.js:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Browser     │    │     Browser     │    │     Browser     │
│   (Vue.js App) │◄──►│   (Vue.js App) │◄──►│   (Vue.js App) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       ▲                       ▲
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                      ┌─────────────────┐
                      │   Gun.js Relay  │
                      │  (Minimal Server)│
                      └─────────────────┘
```

### Key Principles
- **No Central Authority**: No single server controls the data
- **User-Owned Data**: Users control their data through cryptographic keys
- **Offline-First**: Works without internet connectivity
- **Real-Time Sync**: Changes propagate instantly between connected peers

## 🔌 Plugin System

Plugins extend functionality using Module Federation:

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

### Available Plugins
- **event-plugin** - Real-time chat & event management
- **wiki-plugin** - Knowledge sharing & documentation
- **location-plugin** - Location management & mapping
- **link-plugin** - Link sharing & bookmarking

### Plugin Development
Use the **demo-plugin** repository as a template for creating new plugins.

## 🛠️ Development Workflow

### Quick Start
```bash
# Clone and setup
git clone https://github.com/toplocs/tribelike.git
cd tribelike
pnpm install

# Start development
pnpm dev
```

### Common Commands
```bash
pnpm dev          # Start development environment
pnpm build        # Build all workspaces
pnpm test         # Run tests
pnpm lint         # Lint code
pnpm check        # Type checking
```

## 🗄️ Data Structure

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

### Relationship Types
- **Profile-Interest**: `favorite`, `doing`, `expert`, `learning`, `curious`
- **Profile-Location**: `living`, `working`, `traveling`, `visiting`, `current`
- **Profile-Profile**: `following`, `friend`, `family`, `partner`

## 🔍 Debugging

### Browser Console Commands
```javascript
gunDebug.graph()        // Show complete local graph
gunDebug.peers()        // Show connected peers
gunDebug.user()         // Show current user
gunDebug.watch('path')  // Monitor specific path
gunDebug.storage()      // Show Gun data in localStorage
gunDebug.clear()        // Clear all Gun data
```

### Debug Tools
- **Vue DevTools** - Component state inspection
- **Eruda** - Mobile-style console and network inspection
- **Gun Logger** - Custom Gun.js event logging
- **Performance Monitor** - Graph size and memory usage

## 📖 Additional Resources

### External Documentation
- [Gun.js Documentation](https://gun.eco/docs/) - Core P2P database
- [Vue.js Guide](https://vuejs.org/guide/) - Frontend framework
- [WebAuthn Guide](https://webauthn.guide/) - Modern authentication
- [Module Federation](https://module-federation.github.io/) - Plugin system

### Repository Structure
For a complete overview of all TopLocs repositories, see [ecosystem.md](./ecosystem.md).

```
toplocs/ (workspace)
├── tribelike/           # Core platform (THIS REPOSITORY)
├── locations/           # Mobile app
├── *-plugin/           # Plugin repositories
├── gun-*/              # Gun.js proof of concepts
├── demo-plugin/        # Plugin development template
└── project-playground/ # Architecture testing
```

## 🤝 Contributing

1. **Read the Architecture Guide** - Understand the P2P principles
2. **Try Plugin Development** - Start with the demo-plugin template
3. **Use Debug Tools** - Familiarize yourself with debugging techniques
4. **Follow the Patterns** - Study existing code and maintain consistency

### Development Tips
- Use Gun.js for all data persistence
- Follow the universal relations system
- Test with multiple browser tabs for P2P features
- Maintain offline-first functionality

## 🆘 Getting Help

- **Architecture Questions**: See [architecture.md](./architecture.md)
- **Plugin Development**: See [plugin-development.md](./plugin-development.md)
- **Debugging Issues**: See [debug-guide.md](./debug-guide.md)
- **Technical Setup**: See [debug-tools.md](./debug-tools.md)

For additional help, check the [GitHub issues](https://github.com/toplocs/tribelike/issues) or start a discussion.

---

*This documentation covers the core TopLocs ecosystem. For specific repository documentation, check the individual README files in each project.*