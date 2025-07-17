import { r as root } from './index-BtEFTG_k.js';

class GunLogger {
  events = [];
  maxEvents = 100;
  enabled = false;
  filterTypes;
  silentMode = false;
  constructor() {
    const params = new URLSearchParams(location.search);
    this.enabled = params.has("debug") || undefined                                === "true";
    if (!this.enabled) return;
    const debugFilter = params.get("debug");
    if (debugFilter === "silent") {
      this.silentMode = true;
      if (!params.has("quiet")) {
        console.log("%c🔫 Gun Logger Activated (silent mode)", "color: #4CAF50; font-weight: bold");
      }
    } else if (debugFilter && debugFilter !== "true") {
      const allowedTypes = debugFilter.toLowerCase().split(",");
      this.filterTypes = allowedTypes;
      console.log(`%c🔫 Gun Logger Activated (filtering: ${allowedTypes.join(", ")})`, "color: #4CAF50; font-weight: bold");
    } else {
      console.log("%c🔫 Gun Logger Activated", "color: #4CAF50; font-weight: bold");
    }
    this.interceptGunMethods();
    this.logPeerActivity();
    window.gunLog = this;
    window.gunStats = () => this.printStats();
    window.gunRecent = (count) => this.showRecent(count);
    window.gunClear = () => this.clear();
    window.gunGraph = () => this.showGraph();
    window.gunStorage = () => this.showStorage();
    window.gunWatch = (path) => this.watch(path);
    window.gun = root;
  }
  interceptGunMethods() {
    const originalGet = root.get.bind(root);
    const originalPut = root.put.bind(root);
    root.get = (...args) => {
      this.log("GET", args[0], { timestamp: Date.now() });
      return originalGet(...args);
    };
    root.put = (...args) => {
      const data = args[0];
      const key = typeof data === "object" && data ? Object.keys(data)[0] : "data";
      this.log("PUT", key, { timestamp: Date.now(), size: JSON.stringify(data).length });
      return originalPut(...args);
    };
    const originalProto = Object.getPrototypeOf(root);
    const originalOn = originalProto.on;
    originalProto.on = function(...args) {
      const path = this._.get || "unknown";
      window.gunLog?.log("SUBSCRIBE", path, { timestamp: Date.now() });
      return originalOn.apply(this, args);
    };
  }
  logPeerActivity() {
    setTimeout(() => {
      const peers = root.back("opt.peers");
      if (peers) {
        Object.entries(peers).forEach(([url, peer]) => {
          const connected = peer.wire && peer.wire.readyState === 1;
          this.log("PEER", url, {
            status: connected ? "connected" : "disconnected",
            readyState: peer.wire?.readyState
          });
        });
      }
    }, 1e3);
  }
  log(type, path, meta) {
    if (!this.enabled) return;
    if (this.filterTypes && !this.filterTypes.includes(type.toLowerCase())) {
      return;
    }
    const event = {
      type,
      path,
      meta,
      time: (/* @__PURE__ */ new Date()).toISOString(),
      timestamp: Date.now()
    };
    this.events.unshift(event);
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }
    if (!this.silentMode) {
      const styles = {
        GET: "color: #4CAF50; font-weight: bold",
        PUT: "color: #2196F3; font-weight: bold",
        PEER: "color: #FF9800; font-weight: bold",
        SUBSCRIBE: "color: #9C27B0; font-weight: bold",
        ERROR: "color: #F44336; font-weight: bold"
      };
      const style = styles[type] || "color: #9E9E9E";
      console.log(
        `%c[Gun.${type}] %c${path}`,
        style,
        "color: #666",
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
    console.log("%c🗑️  Gun Log Cleared", "color: #FF5722");
  }
  // Get current stats
  getStats() {
    const graphSize = Object.keys(root._.graph || {}).length;
    const peers = root.back("opt.peers") || {};
    const connectedPeers = Object.values(peers).filter(
      (p) => p.wire && p.wire.readyState === 1
    ).length;
    return {
      graphSize,
      totalPeers: Object.keys(peers).length,
      connectedPeers,
      events: this.events.length,
      memory: performance.memory?.usedJSHeapSize || 0
    };
  }
  // Pretty print stats
  printStats() {
    const stats = this.getStats();
    console.group("%c📊 Gun Stats", "color: #00BCD4; font-weight: bold");
    console.log(`Graph Nodes: ${stats.graphSize}`);
    console.log(`Connected Peers: ${stats.connectedPeers}/${stats.totalPeers}`);
    console.log(`Logged Events: ${stats.events}`);
    console.log(`Memory: ${(stats.memory / 1024 / 1024).toFixed(2)} MB`);
    console.groupEnd();
  }
  // Show recent events
  showRecent(count = 10) {
    console.group("%c📜 Recent Gun Activity", "color: #795548; font-weight: bold");
    this.events.slice(0, count).forEach((event) => {
      const timeDiff = Date.now() - event.timestamp;
      const timeAgo = timeDiff < 1e3 ? "just now" : `${Math.floor(timeDiff / 1e3)}s ago`;
      console.log(`[${event.type}] ${event.path} - ${timeAgo}`);
    });
    console.groupEnd();
  }
  // Show complete local graph
  showGraph() {
    const graph = root._.graph || {};
    console.group("%c🌐 Gun Graph", "color: #009688; font-weight: bold");
    console.log(`Total nodes: ${Object.keys(graph).length}`);
    console.log("Graph:", graph);
    console.groupEnd();
    return graph;
  }
  // Show Gun data in localStorage
  showStorage() {
    console.group("%c💾 Gun Storage", "color: #FF5722; font-weight: bold");
    const gunKeys = Object.keys(localStorage).filter((key) => key.startsWith("gun/") || key === "radata");
    console.log(`Gun keys in localStorage: ${gunKeys.length}`);
    gunKeys.forEach((key) => {
      const value = localStorage.getItem(key);
      console.log(`${key}: ${value?.substring(0, 100)}${value && value.length > 100 ? "..." : ""}`);
    });
    console.groupEnd();
  }
  // Watch a specific path
  watch(path) {
    console.log(`%c👁️  Watching: ${path}`, "color: #E91E63; font-weight: bold");
    root.get(path).on((data, key) => {
      console.log(`%c[WATCH] ${path}`, "color: #E91E63; font-weight: bold", { key, data, timestamp: Date.now() });
    });
  }
}
const gunLogger = new GunLogger();

export { gunLogger as default };
