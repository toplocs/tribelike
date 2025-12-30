import Gun from 'gun' // You can also use 'gun' here
import 'gun/sea' // Optional: for user authentication
import 'gun/lib/unset'; //optional
import 'gun/lib/radix'; // optional: for radix index structure
import 'gun/lib/radisk'; // optional: if you're using radisk storage
import 'gun/lib/store'; // optional: if using indexed storage
import 'gun/lib/rindexed'; // required for IndexedDB + RAD

const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';
const peers = import.meta.env.VITE_GUN_PEERS?.split(',') || [];

console.log('🔫 Initializing Gun.js with peers:', peers);
console.log('📍 App version:', APP_VERSION);

// Configure Gun with persistence enabled
// Gun.js will automatically use localStorage for persistence in browser
const gunConfig: any = {
  peers,
  rad: true,
  // Do NOT disable default persistence
};

const gun = Gun(gunConfig);

console.log('✓ Gun.js initialized');
console.log('  - Storage: localStorage (automatic)');
console.log('  - RAD: enabled');
console.log('  - Peers:', peers.length > 0 ? peers : 'none (local only)');

// Verify Gun.js can access storage
const storageTest = gun.get('__storage_test__');
storageTest.put({ test: true }).then(() => {
  console.log('✓ Gun.js storage persistence: WORKING');
}).catch((err) => {
  console.error('✗ Gun.js storage persistence: FAILED', err);
});

const root = gun.get(`toplocs_v${APP_VERSION}`);
console.log('✓ Created root node:', `toplocs_v${APP_VERSION}`);

root.clear = function() {
	// Clear localStorage
	localStorage.clear();

	// If using sessionStorage
	sessionStorage.clear();

	// Optionally clear IndexedDB (requires async code)
	indexedDB.databases().then(dbs => {
	  for (let db of dbs) {
	    indexedDB.deleteDatabase(db.name);
	  }
	});

	console.log('Local data cleared');
}

root.lookup = async function(key: string, id: string) {
	const ref = await root.get(key).get(id).then();
  const soul = ref?._?.['>'] && Object.keys(ref._['>'])[0];
  if (!soul) return null;
  const data = await gun.get(soul).then();

  return data ? { id, ...data } : null;
}

export default root;
