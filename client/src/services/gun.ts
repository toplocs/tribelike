import Gun from 'gun' // You can also use 'gun' here
import 'gun/sea' // Optional: for user authentication
import 'gun/lib/unset'; //optional

const gun = Gun(['http://localhost:3000/gun']);

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
