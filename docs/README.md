# TopLocs Tribelike Documentation

## 📚 Centralized Documentation Hub

**All comprehensive TopLocs documentation is now centralized in the workspace repository:**

👉 **[Complete Documentation Hub](https://github.com/toplocs/toplocs-workspace/tree/main/docs)**

## 📁 Documentation Structure

The centralized docs are organized as:

- **[🚀 Getting Started](https://github.com/toplocs/toplocs-workspace/blob/main/docs/workspace/getting-started.md)** - Complete setup guide
- **[🏗️ Architecture](https://github.com/toplocs/toplocs-workspace/blob/main/docs/project/architecture.md)** - P2P platform technical details
- **[🌐 Ecosystem](https://github.com/toplocs/toplocs-workspace/blob/main/docs/project/ecosystem.md)** - Repository relationships
- **[🔌 Plugin Development](https://github.com/toplocs/toplocs-workspace/blob/main/docs/development/plugin-development.md)** - Create and maintain plugins
- **[🐛 Debug Guide](https://github.com/toplocs/toplocs-workspace/blob/main/docs/development/debug-guide.md)** - Troubleshooting and tools

## 🤖 AI Development Context

For AI-assisted development, use the comprehensive context in the workspace:

👉 **[CLAUDE.md](https://github.com/toplocs/toplocs-workspace/blob/main/CLAUDE.md)**

## 🌐 Live Documentation Site

Browse the complete documentation at:

👉 **https://toplocs.github.io/toplocs-workspace/**

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

## ℹ️ Why Centralized?

The documentation is centralized in the toplocs-workspace for:

- **📍 Single Source of Truth**: No duplicate or conflicting information
- **🔄 Automatic Updates**: AI-powered synchronization with all repositories
- **🔍 Better Discoverability**: Organized structure with clear navigation
- **👥 Team Consistency**: Everyone accesses the same current information
- **🤖 AI Integration**: Comprehensive context for intelligent development assistance

## 💡 Tribelike-Specific Documentation

This repository contains tribelike-specific information:
- CLAUDE.md with development context for this repository
- README.md with repository overview and setup
- Implementation-specific guides and technical details

## 🤝 Contributing to Tribelike

1. **Read the centralized documentation** first in toplocs-workspace
2. **Understand P2P principles** and Gun.js architecture
3. **Follow existing patterns** in the codebase
4. **Test with multiple browser tabs** for P2P features
5. **Maintain offline-first functionality**

### Development Tips
- Use Gun.js for all data persistence
- Follow the universal relations system
- Check the centralized debug guide for troubleshooting
- Use the workspace CLAUDE.md for AI development assistance

## 🆘 Getting Help

- **General Questions**: See [toplocs-workspace documentation](https://github.com/toplocs/toplocs-workspace/tree/main/docs)
- **Tribelike Issues**: Check [GitHub issues](https://github.com/toplocs/tribelike/issues)
- **Development Help**: Use the centralized [AI context](https://github.com/toplocs/toplocs-workspace/blob/main/CLAUDE.md)

---

**For all general TopLocs documentation, visit the centralized hub! 🚀**