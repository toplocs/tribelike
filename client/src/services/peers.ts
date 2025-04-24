export class Peers {
  private gun: any;
  private peerRegistry: any;
  private peerId: string;
  private announcementInterval?: number;

  constructor(gun: any, peerRegistryPath = 'peers') {
    this.gun = gun;
    this.peerRegistry = gun.get(peerRegistryPath);
    this.peerId = this.getPersistentPeerId();
  }

  // Get persistent peer ID or create a new one if it doesn't exist
  private getPersistentPeerId(): string {
    // Create or retrieve a tab-specific identifier
    const tabIdKey = 'gun-tab-id';
    let tabId = sessionStorage.getItem(tabIdKey);

    if (!tabId) {
      // Create a new tab identifier that will be unique to this browser tab
      tabId = `tab-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      sessionStorage.setItem(tabIdKey, tabId);
    }

    // Use the tab ID as part of the storage key to have different IDs per tab
    const storageKey = `gun-peer-id-${tabId}`;
    let storedId = localStorage.getItem(storageKey);

    if (!storedId) {
      storedId = `peer-${Math.random().toString(36).substring(2, 10)}`;
      localStorage.setItem(storageKey, storedId);
    }

    return storedId;
  }

  // Get the peer ID
  public getPeerId(): string {
    return this.peerId;
  }

  // Register this peer in the registry
  public registerPeer(): void {
    this.peerRegistry.get(this.peerId).put({
      id: this.peerId,
      active: true,
      firstSeen: Date.now(),
      lastSeen: Date.now()
    });

    // Initial announcement
    this.announcePeer();
  }

  // Announce this peer's presence to the network
  public announcePeer(): void {
    // Update last seen timestamp
    this.peerRegistry.get(this.peerId).put({
      active: true,
      lastSeen: Date.now()
    });
  }

  // Start periodic announcements
  public async startPeriodicAnnouncements(intervalMs = 15000, callback?: () => void): Promise<void> {
    this.stopPeriodicAnnouncements();
    
    this.registerPeer();
    if (callback) {
      await callback();
    }

    this.announcementInterval = window.setInterval(async () => {
      this.announcePeer();
      
      // Execute the callback after each announcement if provided
      if (callback) {
        await callback();
      }
    }, intervalMs);
  }

  // Stop periodic announcements
  public stopPeriodicAnnouncements(): void {
    if (this.announcementInterval) {
      clearInterval(this.announcementInterval);
      this.announcementInterval = undefined;
    }
  }

  // Check for active peers in the registry
  public getActivePeers(): Promise<string[]> {
    return new Promise((resolve) => {
      const activePeers: string[] = [];
      const cutoffTime = Date.now() - 20000; // 20 seconds ago

      this.peerRegistry.map().once((data: any, id: string) => {
        if (data && id !== this.peerId) {
          const isStale = data.lastSeen < cutoffTime;

          if (data.active && !isStale) {
            activePeers.push(`${id} (registry)`);
          }
        }
      });

      // Give Gun a moment to gather data before resolving
      setTimeout(() => resolve(activePeers), 100);
    });
  }

  // Function to get the list of connected peers
  public getConnectedPeers(): string[] {
    const connectedPeers: string[] = [];

    // Check direct peer connections via Gun
    const peersList = this.gun.back('opt').peers || {};

    // Check each peer connection
    for (const id in peersList) {
      if (Object.prototype.hasOwnProperty.call(peersList, id)) {
        const peer = peersList[id];

        // Only include peers that are actually connected
        if (peer && peer.wire && peer.wire.constructor) {
          const readyState = peer.wire.readyState;
          const status = readyState === 1 ? 'connected' : 'disconnected';
          connectedPeers.push(`${id} (${status})`);
        } else {
          connectedPeers.push(`${id} (unknown)`);
        }
      }
    }

    return connectedPeers;
  }

  // Function to generate a data overview
  public async generateDataOverview(key: string): Promise<string> {
    try {
      const overview: Record<string, any> = {};

      // Get node data
      await new Promise((resolve) => {
        this.gun.get(key).once((data: any) => {
          overview[key] = { _: 'node', ...data };
          resolve(data);
        });
      });

      const fetchReferences = async (node: any, result: Record<string, any>) => {
        for (const key in node) {
          if (key !== '_' && typeof node[key] === 'object' && node[key] !== null) {
            const ref = node[key]['#'];
            if (ref) {
              await new Promise((resolve) => {
                this.gun.get(ref).once((refData: any) => {
                  result[ref] = { _: 'reference', ...refData };
                  fetchReferences(refData, result).then(resolve);
                });
              });
            }
          }
        }
      };

      await fetchReferences(overview[key], overview);

      return JSON.stringify(overview, null, 2);
    } catch (error: any) {
      return `Error generating overview: ${error.message}`;
    }
  }

  // Clean up resources when no longer needed
  public destroy(): void {
    this.stopPeriodicAnnouncements();
  }
}
