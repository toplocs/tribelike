import Gun from 'gun' // You can also use 'gun' here
import 'gun/sea' // Optional: for user authentication
import 'gun/lib/unset'; //optional
import 'gun/lib/radix'; // optional: for radix index structure
import 'gun/lib/radisk'; // optional: if you're using radisk storage
import 'gun/lib/store'; // optional: if using indexed storage
import 'gun/lib/rindexed'; // required for IndexedDB + RAD

const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';
const peers = import.meta.env.VITE_GUN_PEERS?.split(',') || [];

// Check if localStorage is available
const hasLocalStorage = typeof localStorage !== 'undefined';
console.log('Browser localStorage available:', hasLocalStorage);

// Configure Gun with proper persistence
// Gun uses localStorage by default if available, but we can also use IndexedDB
const gunConfig: any = {
  peers,
  rad: true,
};

// Add localStorage adapter if available
if (hasLocalStorage) {
  // Gun will automatically persist to localStorage
  gunConfig.localStorage = true;
}

const gun = Gun(gunConfig);

console.log('Gun.js initialized with config:', gunConfig);

// Test persistence: check if we can read/write to localStorage
if (hasLocalStorage) {
  try {
    localStorage.setItem('__gun_test__', 'test');
    const test = localStorage.getItem('__gun_test__');
    localStorage.removeItem('__gun_test__');
    console.log('localStorage persistence test: OK');
  } catch (e) {
    console.warn('localStorage persistence test failed:', e);
  }
}
const root = gun.get(`toplocs_v${APP_VERSION}`);

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
