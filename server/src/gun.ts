import Gun from 'gun';

let gun: any;

export function initGun(server: Object) {
  gun = Gun({ peers: [], file: 'ra-data' });

  return gun;
}

export function getGun() {
  if (!gun) {
    throw new Error('Gun has not been initialized. Call initGun(server) first.');
  }
  return gun;
}
