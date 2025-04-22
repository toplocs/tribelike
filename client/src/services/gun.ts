import Gun from 'gun' // You can also use 'gun' here
import 'gun/sea' // Optional: for user authentication

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

export default gun;
