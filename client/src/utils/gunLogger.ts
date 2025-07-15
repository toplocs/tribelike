import gun from '@/services/gun';

interface GunEvent {
  type: string;
  path: string;
  meta: any;
  time: string;
  timestamp: number;
}

class GunLogger {
  private events: GunEvent[] = [];
  private maxEvents = 100;
  private enabled = false;
  private filterTypes?: string[];
  private silentMode = false;
  
  constructor() {
    const params = new URLSearchParams(location.search);
    
    // Enable for dev, with ?debug=true, or via build-time flag
    this.enabled = import.meta.env.DEV || params.has('debug') || import.meta.env.VITE_DEBUG_MODE === 'true';
    
    if (!this.enabled) return;
    
    // Check for debug filters
    const debugFilter = params.get('debug');
    if (debugFilter === 'silent') {
      // Silent mode - no console output at all
      this.silentMode = true;
      // Still show activation message unless quiet
      if (!params.has('quiet')) {
        console.log('%c🔫 Gun Logger Activated (silent mode)', 'color: #4CAF50; font-weight: bold');
      }
    } else if (debugFilter && debugFilter !== 'true') {
      // Filter by type: ?debug=peer or ?debug=get,subscribe
      const allowedTypes = debugFilter.toLowerCase().split(',');
      this.filterTypes = allowedTypes;
      console.log(`%c🔫 Gun Logger Activated (filtering: ${allowedTypes.join(', ')})`, 'color: #4CAF50; font-weight: bold');
    } else {
      console.log('%c🔫 Gun Logger Activated', 'color: #4CAF50; font-weight: bold');
    }
    
    // Intercept Gun operations
    this.interceptGunMethods();
    
    // Log peer connections
    this.logPeerActivity();
    
    // Make available globally (for both browser console and Eruda)
    (window as any).gunLog = this;
    
    // Also expose individual methods for easier access
    (window as any).gunStats = () => this.printStats();
    (window as any).gunRecent = (count?: number) => this.showRecent(count);
    (window as any).gunClear = () => this.clear();
    (window as any).gunGraph = () => this.showGraph();
    (window as any).gunStorage = () => this.showStorage();
    (window as any).gunWatch = (path: string) => this.watch(path);
    
    // Expose gun instance for direct access in debug mode
    (window as any).gun = gun;
  }
  
  private interceptGunMethods() {
    const originalGet = gun.get.bind(gun);
    const originalPut = gun.put.bind(gun);
    
    // Intercept .get() calls
    gun.get = (...args: any[]) => {
      this.log('GET', args[0], { timestamp: Date.now() });
      return originalGet(...args);
    };
    
    // Intercept .put() calls
    gun.put = (...args: any[]) => {
      const data = args[0];
      const key = typeof data === 'object' && data ? Object.keys(data)[0] : 'data';
      this.log('PUT', key, { timestamp: Date.now(), size: JSON.stringify(data).length });
      return originalPut(...args);
    };
    
    // Intercept .on() for monitoring subscriptions
    const originalProto = Object.getPrototypeOf(gun);
    const originalOn = originalProto.on;
    
    originalProto.on = function(this: any, ...args: any[]) {
      const path = this._.get || 'unknown';
      (window as any).gunLog?.log('SUBSCRIBE', path, { timestamp: Date.now() });
      return originalOn.apply(this, args);
    };
  }
  
  private logPeerActivity() {
    // Check initial peer status
    setTimeout(() => {
      const peers = gun.back('opt.peers');
      if (peers) {
        Object.entries(peers).forEach(([url, peer]: [string, any]) => {
          const connected = peer.wire && peer.wire.readyState === 1;
          this.log('PEER', url, { 
            status: connected ? 'connected' : 'disconnected',
            readyState: peer.wire?.readyState 
          });
        });
      }
    }, 1000);
  }
  
  private log(type: string, path: string, meta: any) {
    if (!this.enabled) return;
    
    // Apply filter if set
    if (this.filterTypes && !this.filterTypes.includes(type.toLowerCase())) {
      return;
    }
    
    const event: GunEvent = { 
      type, 
      path, 
      meta, 
      time: new Date().toISOString(),
      timestamp: Date.now()
    };
    
    this.events.unshift(event);
    
    // Keep only last N events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }
    
    // Only log to console if not in silent mode
    if (!this.silentMode) {
      // Fancy console output
      const styles = {
        GET: 'color: #4CAF50; font-weight: bold',
        PUT: 'color: #2196F3; font-weight: bold', 
        PEER: 'color: #FF9800; font-weight: bold',
        SUBSCRIBE: 'color: #9C27B0; font-weight: bold',
        ERROR: 'color: #F44336; font-weight: bold'
      };
      
      const style = styles[type as keyof typeof styles] || 'color: #9E9E9E';
      
      console.log(
        `%c[Gun.${type}] %c${path}`,
        style,
        'color: #666',
        meta
      );
    }
  }
  
  // Public methods
  getEvents() { 
    return this.events; 
  }
  
  clear() { 
    this.events = []; 
    console.log('%c🗑️  Gun Log Cleared', 'color: #FF5722');
  }
  
  // Get current stats
  getStats() {
    const graphSize = Object.keys(gun._.graph || {}).length;
    const peers = gun.back('opt.peers') || {};
    const connectedPeers = Object.values(peers).filter((p: any) => 
      p.wire && p.wire.readyState === 1
    ).length;
    
    return {
      graphSize,
      totalPeers: Object.keys(peers).length,
      connectedPeers,
      events: this.events.length,
      memory: (performance as any).memory?.usedJSHeapSize || 0
    };
  }
  
  // Pretty print stats
  printStats() {
    const stats = this.getStats();
    console.group('%c📊 Gun Stats', 'color: #00BCD4; font-weight: bold');
    console.log(`Graph Nodes: ${stats.graphSize}`);
    console.log(`Connected Peers: ${stats.connectedPeers}/${stats.totalPeers}`);
    console.log(`Logged Events: ${stats.events}`);
    console.log(`Memory: ${(stats.memory / 1024 / 1024).toFixed(2)} MB`);
    console.groupEnd();
  }
  
  // Show recent events
  showRecent(count = 10) {
    console.group('%c📜 Recent Gun Activity', 'color: #795548; font-weight: bold');
    this.events.slice(0, count).forEach(event => {
      const timeDiff = Date.now() - event.timestamp;
      const timeAgo = timeDiff < 1000 ? 'just now' : `${Math.floor(timeDiff / 1000)}s ago`;
      console.log(`[${event.type}] ${event.path} - ${timeAgo}`);
    });
    console.groupEnd();
  }
  
  // Show complete local graph
  showGraph() {
    const graph = gun._.graph || {};
    console.group('%c🌐 Gun Graph', 'color: #009688; font-weight: bold');
    console.log(`Total nodes: ${Object.keys(graph).length}`);
    console.log('Graph:', graph);
    console.groupEnd();
    return graph;
  }
  
  // Show Gun data in localStorage
  showStorage() {
    console.group('%c💾 Gun Storage', 'color: #FF5722; font-weight: bold');
    const gunKeys = Object.keys(localStorage).filter(key => key.startsWith('gun/') || key === 'radata');
    console.log(`Gun keys in localStorage: ${gunKeys.length}`);
    gunKeys.forEach(key => {
      const value = localStorage.getItem(key);
      console.log(`${key}: ${value?.substring(0, 100)}${value && value.length > 100 ? '...' : ''}`);
    });
    console.groupEnd();
  }
  
  // Watch a specific path
  watch(path: string) {
    console.log(`%c👁️  Watching: ${path}`, 'color: #E91E63; font-weight: bold');
    gun.get(path).on((data: any, key: string) => {
      console.log(`%c[WATCH] ${path}`, 'color: #E91E63; font-weight: bold', { key, data, timestamp: Date.now() });
    });
  }
}

// Auto-initialize
const gunLogger = new GunLogger();

export default gunLogger;