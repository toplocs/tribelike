import Gun from 'gun' // You can also use 'gun' here
import 'gun/sea' // Optional: for user authentication
import 'gun/lib/unset'; //optional
import 'gun/lib/radix'; // optional: for radix index structure
import 'gun/lib/radisk'; // optional: if you're using radisk storage
import 'gun/lib/store'; // optional: if using indexed storage
import 'gun/lib/rindexed'; // required for IndexedDB + RAD

const peers = import.meta.env.VITE_GUN_PEERS?.split(',') || [];

const gun = Gun({ peers, rad: true });

gun.clear = function() {
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

gun.lookup = async function(key: string, id: string) {
	const ref = await gun.get(key).get(id).then();
  const soul = ref?._?.['>'] && Object.keys(ref._['>'])[0];
  if (!soul) return null;
  const data = await gun.get(soul).then();

  return data ? { id, ...data } : null;
}

export default gun;
