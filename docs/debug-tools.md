# Tribelike Debug Tools - Implementation Guide

## Overview

Since Gun.js doesn't have its own DevTools, we combine multiple tools for an effective debug setup:

1. **Vue/Vite DevTools** - For Vue Components and State
2. **Eruda** - For Mobile-Style Console and Network
3. **Minimal Gun.js Logger** - Custom for Gun-specific events
4. **Performance Monitor** - For Gun.js Graph Size and Memory

## 1. Vue DevTools (Foundation)

### Installation
```bash
pnpm add -D vite-plugin-vue-devtools
```

### Configuration
```javascript
// vite.config.ts
import VueDevTools from 'vite-plugin-vue-devtools'

export default {
  plugins: [
    vue(),
    VueDevTools({
      // Only in development
      enabled: true,
    })
  ]
}
```

### Usage
- Shows Component Tree with all providers (User, Profile, Relations)
- Timeline for Gun.js triggers
- Custom inspector for Gun state possible

## 2. Eruda (Mobile Console)

### Installation
```bash
pnpm add -D eruda
```

### Integration
```javascript
// main.ts
if (import.meta.env.DEV || window.location.search.includes('debug')) {
  import('eruda').then(({ default: eruda }) => {
    eruda.init({
      container: document.body,
      tool: ['console', 'network', 'resources', 'info'],
      useShadowDom: true,
      autoScale: true
    });
    
    // Position bottom right
    eruda.position({ x: window.innerWidth - 50, y: window.innerHeight - 50 });
  });
}
```

### Features
- **Console**: Filterable log output
- **Network**: WebSocket connections to Gun peers
- **Resources**: LocalStorage with `gun/*` entries
- **Info**: Memory usage, page load time

## 3. Gun.js Activity Logger

### Minimal Implementation
```javascript
// utils/gunLogger.ts
import gun from '@/services/gun';

class GunLogger {
  private events: any[] = [];
  private maxEvents = 100;
  
  constructor() {
    if (!import.meta.env.DEV) return;
    
    // Intercept Gun operations
    this.interceptGunMethods();
    
    // Log peer connections
    this.logPeerActivity();
    
    // Make available globally
    (window as any).gunLog = this;
  }
  
  private interceptGunMethods() {
    const originalGet = gun.get.bind(gun);
    const originalPut = gun.put?.bind(gun);
    
    gun.get = (...args: any[]) => {
      this.log('GET', args[0], { timestamp: Date.now() });
      return originalGet(...args);
    };
    
    if (originalPut) {
      gun.put = (...args: any[]) => {
        this.log('PUT', args[0], { data: args[1], timestamp: Date.now() });
        return originalPut(...args);
      };
    }
  }
  
  private logPeerActivity() {
    // WebSocket Status
    const peers = gun.back('opt.peers');
    Object.entries(peers || {}).forEach(([url, peer]: [string, any]) => {
      this.log('PEER', url, { status: peer.wire ? 'connected' : 'disconnected' });
    });
  }
  
  private log(type: string, path: string, meta: any) {
    const event = { type, path, meta, time: new Date().toISOString() };
    this.events.unshift(event);
    
    // Keep only last N events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }
    
    // Fancy console output
    const color = {
      GET: '#4CAF50',
      PUT: '#2196F3', 
      PEER: '#FF9800',
      ERROR: '#F44336'
    }[type] || '#9E9E9E';
    
    console.log(
      `%c${type} %c${path}`,
      `color: ${color}; font-weight: bold`,
      'color: #666',
      meta
    );
  }
  
  // Public methods
  getEvents() { return this.events; }
  clear() { this.events = []; }
  
  // Stats
  getStats() {
    return {
      graphSize: Object.keys(gun._.graph || {}).length,
      events: this.events.length,
      peers: Object.keys(gun.back('opt.peers') || {}).length,
      memory: (performance as any).memory?.usedJSHeapSize
    };
  }
}

export default GunLogger;
```

### Integration in main.ts
```javascript
if (import.meta.env.DEV) {
  import('./utils/gunLogger').then(({ default: GunLogger }) => {
    new GunLogger();
  });
}
```

## 4. Debug UI Component (Optional)

### Floating Debug Panel
```vue
<!-- components/debug/DebugPanel.vue -->
<template>
  <div v-if="showDebug" class="debug-panel">
    <div class="debug-header">
      <h3>🔫 Gun Debug</h3>
      <button @click="showDebug = false">×</button>
    </div>
    
    <div class="debug-stats">
      <div>Graph: {{ stats.graphSize }} nodes</div>
      <div>Peers: {{ stats.peers }}</div>
      <div>Memory: {{ formatBytes(stats.memory) }}</div>
    </div>
    
    <div class="debug-events">
      <div v-for="event in events" :key="event.time" class="event">
        <span :class="`type-${event.type.toLowerCase()}`">{{ event.type }}</span>
        <span>{{ event.path }}</span>
        <span class="time">{{ formatTime(event.time) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.debug-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 400px;
  max-height: 500px;
  background: #1e1e1e;
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  font-family: 'Monaco', monospace;
  font-size: 12px;
  z-index: 9999;
}

.type-get { color: #4CAF50; }
.type-put { color: #2196F3; }
.type-peer { color: #FF9800; }
</style>
```

## 5. Keyboard Shortcuts

```javascript
// Keyboard shortcuts for debug mode
document.addEventListener('keydown', (e) => {
  // Cmd/Ctrl + Shift + D
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'D') {
    (window as any).gunLog?.showPanel();
  }
});
```

## 6. Production Debug Mode

For production debugging without code changes:

```javascript
// Activation via URL parameter
// https://tribelike.shniq.dev?debug=true

if (new URLSearchParams(location.search).has('debug')) {
  // Load debug tools
}
```

## Summary

This combination provides:

1. **Vue DevTools**: Component State Inspection
2. **Eruda**: Network/Console/Storage in a nice UI
3. **Gun Logger**: Specific Gun.js events with colors
4. **Debug Panel**: Optional for dedicated Gun stats

### Advantages
- Minimal code (< 200 lines)
- Uses proven tools (Eruda)
- Gun-specific features
- Works on mobile
- Production debug possible

### Complete Installation
```bash
pnpm add -D vite-plugin-vue-devtools eruda
```

Then just add Logger + Integration = Done! 🚀