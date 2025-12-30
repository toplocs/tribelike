import gun from '@/services/gun';

/**
 * Waits for Gun.js to be ready for operations.
 * If peers are configured, waits for at least one peer connection.
 * If no peers are configured, resolves immediately (local mode).
 *
 * @param timeout - Maximum time to wait in milliseconds (default: 5000)
 * @returns Promise that resolves when Gun is ready
 */
export function waitForGunReady(timeout: number = 5000): Promise<void> {
  return new Promise((resolve, reject) => {
    const peers = gun.back('opt.peers');
    const peerUrls = Object.keys(peers || {});

    // If no peers configured, Gun works in local mode immediately
    if (peerUrls.length === 0) {
      resolve();
      return;
    }

    // Check if any peer is already connected
    const isConnected = Object.values(peers).some((peer: any) =>
      peer.wire && peer.wire.readyState === 1
    );

    if (isConnected) {
      resolve();
      return;
    }

    // Wait for a peer connection with timeout
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      const peers = gun.back('opt.peers');
      const connectedPeer = Object.values(peers).some((peer: any) =>
        peer.wire && peer.wire.readyState === 1
      );

      if (connectedPeer) {
        clearInterval(checkInterval);
        resolve();
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        console.warn(`Gun peer connection timeout (${timeout}ms). Proceeding anyway.`);
        resolve(); // Resolve anyway after timeout to allow offline functionality
      }
    }, 100);
  });
}
