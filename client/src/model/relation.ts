// Model Relations
// allows testing and strong types

type uuid = string;
type ObjectType = 'interest' | 'location' | 'profile';
type RelationType = 'profile-profile' | 'profile-location' | 'profile-interest' | 'location-location' | 'location-interest' | 'interest-interest';

interface UserInterface {
  id: string;
}

class User implements UserInterface {
  id: string;
  constructor(id: string) {
    this.id = id;
  }
}

interface RelationKeyInterface {
  value: string;
  label: string;
  title: string;
  description: string;
}

interface RelatedObjectInterface {
  id: uuid;
  name: string;
  isA: ObjectType;                // Is a location, interest, or profile
}

interface ProfileInterface extends RelatedObjectInterface {
  user: UserInterface;
}

class Profile implements ProfileInterface {
  id: uuid;
  name: string;
  isA: ObjectType;
  user: User;

  constructor(name: string, user: User, id: string = "unknown profile") {
    this.id = id;
    this.name = name;
    this.isA = 'profile';
    this.user = user;
  }
}

interface RelationInterface {
  id: uuid;                       // Id of the relation
  key: RelationKeyInterface;      // Relation Key
  from: RelatedObjectInterface;   // Related Object Type
  to: RelatedObjectInterface;     // Other related Object Type
}

class RelatedObject implements RelatedObjectInterface {
  id: uuid;
  name: string;
  isA: ObjectType;

  constructor(id: uuid, name: string, isA: ObjectType) {
    this.id = id;
    this.name = name;
    this.isA = isA;
  }
}

class RelationKey implements RelationKeyInterface {
  value: string;
  label: string;
  title: string;
  description: string;

  constructor(value: string, label: string, title: string, description: string) {
    this.value = value;
    this.label = label;
    this.title = title;
    this.description = description;
  }
}

class Relation implements RelationInterface {
  id: uuid;
  key: RelationKeyInterface;
  from: RelatedObjectInterface;
  to: RelatedObjectInterface;

  constructor(key: RelationKeyInterface, from: RelatedObjectInterface, to: RelatedObjectInterface) {
    this.id = "unknown";
    this.key = key;
    this.from = from;
    this.to = to;
  }

  // fetchAll(id) {
  //   // fetch

  //   return Relations[]
  // }

  toString(): string {
    return `${this.key.title}: ${this.from.name} ${this.key.label} ${this.to.name}`;
  }
}

function getValidRelationKeys(from: RelatedObjectInterface, to: RelatedObjectInterface): RelationKey[] {
  const relationType = `${from.isA}-${to.isA}` as RelationType;
  if (!relationKeys[relationType]) return [];
  return relationKeys[relationType];
}

function getRelationKey(value: string, from: RelatedObjectInterface, to: RelatedObjectInterface): RelationKey | undefined {
  const validKeys = getValidRelationKeys(from, to);
  return validKeys.find(key => key.value === value);
}

const relations: Relation[] = [];

function createRelation(keyValue: string, from: RelatedObjectInterface, to: RelatedObjectInterface): Relation | undefined {
  const key = getRelationKey(keyValue, from, to);
  if (!key) return undefined;
  const relation = new Relation(key, from, to);
  relations.push(relation);
  return relation;
}

export {
  RelationKey,
  Relation
};

export type {
  ObjectType,
  RelationType
};
