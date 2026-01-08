import Gun from 'gun';

let gun: any;

export function initGun(server: any) {
  // Attach Gun relay to the HTTP/HTTPS server for WebSocket support
  gun = Gun({
    web: server,
    peers: [],
  });

  return gun;
}

export function getGun() {
  if (!gun) {
    throw new Error('Gun has not been initialized. Call initGun(server) first.');
  }
  return gun;
}
