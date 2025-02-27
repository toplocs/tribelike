// Examples & Testing

// Create some example objects

import relationKeys from '@/assets/defaultRelationKeys'

const dbprofile = {
  id: "asdf",
  username: "felix",
  user: {id: "1234" },
}

const p = new Profile(
  dbprofile.username, 
  new User(dbprofile.user.id), 
  dbprofile.id
);

console.log(p as RelatedObjectInterface);


const john = new RelatedObject('1', 'John', 'profile');
const felix = new RelatedObject('2', 'Felixi', 'profile');
const yannik = new RelatedObject('3', 'Yannik', 'profile');

const merzig = new RelatedObject('101', 'Merzig', 'location');
const erfurt = new RelatedObject('102', 'Erfurt', 'location');

const surfing = new RelatedObject('1001', 'Surfing', 'interest');
const kitesurfing = new RelatedObject('1002', 'Kite Surfing', 'interest');
const wavesurfing = new RelatedObject('1003', 'Wave Surfing', 'interest');
const chess = new RelatedObject('1004', 'Chess', 'interest');
const yoga = new RelatedObject('1005', 'Yoga', 'interest');


const category = new RelatedObject('10000', 'Category', 'interest');
const sport = new RelatedObject('10001', 'Sport', 'interest');

const profiles = [p, john, felix, yannik];
const locations = [merzig, erfurt];
const sportInterests = [surfing, kitesurfing, wavesurfing, chess, yoga];
const categories = [category, sport];

// Setup Category Root
createRelation('isA', sport, category);

// Set all sport interests to be in the sport category
for (const interest of sportInterests) {
  createRelation('isA', interest, sport);
}

createRelation('childOf', kitesurfing, surfing);
createRelation('childOf', wavesurfing, surfing);

createRelation('like', john, kitesurfing);
createRelation('like', john, chess);
createRelation('like', john, erfurt);

createRelation('like', felix, kitesurfing);
createRelation('expert', felix, kitesurfing);
createRelation('expert', felix, surfing);
createRelation('curious', felix, wavesurfing);
createRelation('like', felix, erfurt);

createRelation('like', yannik, yoga);
createRelation('like', yannik, chess);
createRelation('like', yannik, merzig);

createRelation('like', p, surfing);


// Print all relations
// for (const relation of relations) {
//   console.log(relation);
// }

// Find all profiles that have a relation to chess
const chessPlayers = relations
  .filter(relation => relation.to.id === chess.id)
  .map(relation => relation.from.name);

console.log('Chess players:', chessPlayers.join(', '));

// Find all interests that have a relation to sport
const sports = relations
  .filter(relation => relation.to.id === sport.id)
  .map(relation => relation.from.name);

console.log('Sports:', sports.join(', '));

// Find all descendants of surfing
const surfingChildren = relations
  .filter(relation => relation.to.id === surfing.id && relation.from.isA === "interest")
  .map(relation => relation.from.name);

console.log('Surfing types:', surfingChildren.join(', '));

// Find all Felix's relations
const felixRelations = relations
  .filter(relation => relation.from.id === felix.id)
  .map(relation => `${relation.to.name} (${relation.key.label})`);

console.log("Felix:", felixRelations.join(', '));

// Print each profile's favorite locations and interests
for (const profile of profiles) {
  const favorites = relations
    .filter(relation => relation.from.id == profile.id)
    .map(relation => `${relation.to.name} (${relation.key.label})`);
  
  console.log(`${profile.name}:`, favorites.join(', '));
}