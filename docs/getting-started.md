# Getting Started with TopLocs Development

This guide helps new developers set up the complete TopLocs ecosystem and get Claude Code context in place for AI-assisted development.

## 🚀 Quick Setup for New Developers

### Prerequisites
- **Node.js** >= 20
- **pnpm** >= 8 (recommended) or npm
- **Git** with SSH keys configured for GitHub
- **Claude Code** (optional but recommended for AI assistance)

### Complete Ecosystem Setup

#### 1. Create Your Workspace
```bash
# Create your toplocs workspace folder
mkdir toplocs
cd toplocs
```

#### 2. Clone All Repositories
Copy and paste this command block to clone the entire ecosystem:

```bash
# Core Platform
git clone git@github.com:toplocs/tribelike.git
git clone git@github.com:toplocs/locations.git
git clone git@github.com:toplocs/tribelike.wiki.git

# Plugin Ecosystem  
git clone git@github.com:toplocs/event-plugin.git
git clone git@github.com:toplocs/wiki-plugin.git
git clone git@github.com:toplocs/location-plugin.git
git clone git@github.com:toplocs/link-plugin.git

# Development Tools
git clone git@github.com:toplocs/demo-plugin.git

```

#### 3. Verify Your Setup
After cloning, your folder structure should look like this:
```
toplocs/
├── tribelike/           # Core platform ⭐
├── locations/           # Mobile app
├── tribelike.wiki/      # Documentation
├── event-plugin/        # Chat & events plugin
├── wiki-plugin/         # Wiki plugin  
├── location-plugin/     # Location plugin
├── link-plugin/         # Link plugin
├── demo-plugin/         # Plugin development framework

```

## 🤖 Setting Up Claude Code Context

If you're using Claude Code for AI-assisted development, use this prompt to get full context:

### Claude Setup Prompt
```
I'm working on the TopLocs ecosystem - a decentralized P2P community platform. I've cloned all repositories into my toplocs folder. Please help me set up the development environment and provide context for working with this ecosystem.

The toplocs folder contains these repositories:
- tribelike (core platform)
- locations (mobile app) 
- Multiple *-plugin repositories
- Several PoC repositories for testing
- demo-plugin (development framework)

Please:
1. Read the documentation in tribelike/docs/ to understand the ecosystem
2. Help me set up the development environment
3. Provide guidance on where to start based on what I want to work on
```

### Alternative: Quick Context Setup
If you want Claude to set up everything automatically:

```
I cleaned up my toplocs folder and want to set up the complete TopLocs ecosystem. Please:

1. Clone all missing repositories from the toplocs GitHub organization
2. Set up the development environment
3. Provide me with comprehensive context about the ecosystem
4. Help me understand how to start contributing

The main repository is tribelike (core platform) and there should be multiple plugin repositories, mobile app, and development tools.
```

## 🛠️ Development Environment Setup

### 1. Core Platform (tribelike) - Start Here
```bash
cd tribelike
pnpm install
pnpm dev  # Starts client and server
```

Open http://localhost:3000 to see the platform running.

### 2. Plugin Development
```bash
cd demo-plugin
pnpm install
pnpm dev  # Starts plugin development environment
```

### 3. Mobile App (Optional)
```bash
cd locations
npm install
npm run dev  # Web development
# For native: ionic cap run ios
```

## 📖 Understanding the Ecosystem

### Core Concepts
1. **P2P Architecture** - No central server, data owned by users
2. **Gun.js** - Decentralized graph database for real-time sync
3. **Module Federation** - Dynamic plugin loading system
4. **WebAuthn** - Modern passkey-based authentication

### Key Files to Review
- `tribelike/docs/ecosystem.md` - Complete ecosystem overview
- `tribelike/docs/architecture.md` - P2P architecture details
- `tribelike/CLAUDE.md` - AI development context
- `tribelike/README.md` - Core platform overview

## 🎯 What to Work On

### For New Contributors

#### 1. Frontend/UI Development
**Start with:** `tribelike/client/`
- Vue.js 3 + TypeScript
- TailwindCSS for styling
- Gun.js for data

**Good first tasks:**
- Improve existing components
- Add new UI features
- Fix responsive design issues

#### 2. Plugin Development  
**Start with:** `demo-plugin/`
- Study existing plugins
- Create your own plugin
- Test with the demo framework

**Good first tasks:**
- Add features to existing plugins
- Create a simple new plugin
- Improve plugin documentation

#### 3. P2P/Backend Development
**Start with:** `tribelike/server/` and Gun.js PoCs
- Minimal Express server
- Gun.js relay configuration
- P2P networking

**Good first tasks:**
- Optimize Gun.js performance
- Add server monitoring
- Test P2P synchronization

#### 4. Mobile Development
**Start with:** `locations/`
- Ionic + Capacitor
- Vue.js mobile components
- Native features

**Good first tasks:**
- Improve location features
- Add offline functionality
- Enhance mobile UI

## 🔧 Development Workflow

### Daily Development
```bash
# 1. Start core platform
cd tribelike && pnpm dev

# 2. In another terminal, start plugin development (if needed)
cd demo-plugin && pnpm dev

# 3. Make changes and test
# 4. Run tests before committing
cd tribelike && pnpm test
```

### Testing P2P Features
1. Open multiple browser tabs
2. Create different user accounts
3. Test real-time synchronization
4. Verify offline functionality

### Debugging
```bash
# Use debug commands in browser console
gunDebug.graph()    # Show local data
gunDebug.peers()    # Show connected peers
gunDebug.user()     # Show current user
```

## 📋 Contribution Checklist

### Before Starting Development
- [ ] Clone all repositories
- [ ] Read `tribelike/docs/ecosystem.md`
- [ ] Set up development environment
- [ ] Understand P2P architecture
- [ ] Choose your focus area

### Before Making Changes
- [ ] Create a feature branch
- [ ] Understand existing patterns
- [ ] Follow the coding style
- [ ] Test with multiple browser tabs (for P2P)

### Before Submitting PR
- [ ] Run tests: `pnpm test`
- [ ] Run linting: `pnpm lint`
- [ ] Test offline functionality
- [ ] Update documentation if needed
- [ ] Test plugin loading (if relevant)

## 🆘 Getting Help

### Documentation
1. **Start here:** `tribelike/docs/README.md`
2. **Architecture:** `tribelike/docs/architecture.md`
3. **Plugin development:** `tribelike/docs/plugin-development.md`
4. **Debugging:** `tribelike/docs/debug-guide.md`

### Community
- **GitHub Issues:** Report bugs and request features
- **Discussions:** Ask questions and share ideas
- **Wiki:** `tribelike.wiki/` for project documentation

### Common Issues

#### "npm install fails"
- Use `pnpm install` instead
- Check Node.js version (need >= 20)

#### "Can't connect to Gun peers"
- Check if server is running: `cd tribelike && pnpm dev`
- Open browser console and run `gunDebug.peers()`

#### "Plugin not loading"
- Check Module Federation config in `vite.config.ts`
- Verify plugin is registered in Gun.js
- Use demo-plugin for testing

#### "Authentication not working"
- Clear browser data: `gunDebug.clear()`
- Check WebAuthn support in browser
- Test with localhost (not 127.0.0.1)

## 🎉 Welcome to TopLocs!

You're now ready to contribute to a cutting-edge decentralized community platform. The ecosystem is designed to be:

- **Beginner-friendly** - Start with UI improvements
- **Research-oriented** - Experiment with P2P technologies  
- **Plugin-extensible** - Add new functionality easily
- **Community-driven** - Your contributions shape the platform

Choose your path and start building the future of decentralized communities! 🚀

---

*For AI assistance, share this guide with Claude Code and ask for help with your specific goals.*