import { Uuid, GenericObject } from './Uuid';

export let ProfileInterestKeys = [
    'favorite', 'doing', 
    'expert', 'learning',
    'curious', 'value', 
    'reading', 'watching',
    'playing', 'supporting',
    'giving', 'receiving',
    'admin', 'moderator'
];

export let ProfileLocationKeys = [
    'favorite', 'curious',
    'living', 'working', 
    'traveling', 'visiting',
    'supporting', 'value',
    'current', 'future', 'past',
    'admin', 'moderator'
];

export let ProfileProfileKeys = [
    'following', 'friend',
    'family', 'partner'
];

export let LocationInterestKeys = [
    'category', 'tag'
];

export let InterestInterestKeys = [
    'child', 'parent', 'related',
    'category', 'tag',
    'governs'
];

export let LocationLocationKeys = [
    'child', 'parent'
];

export type ProfileInterestKeyType = typeof ProfileInterestKeys[number];
export type ProfileLocationKeyType = typeof ProfileLocationKeys[number];
export type ProfileProfileKeyType = typeof ProfileProfileKeys[number];
export type LocationInterestKeyType = typeof LocationInterestKeys[number];
export type InterestInterestKeyType = typeof InterestInterestKeys[number];
export type LocationLocationKeyType = typeof LocationLocationKeys[number];

export interface ProfileInterest extends GenericObject {
    id: Uuid;
    key: ProfileInterestKeyType;
    profileId: Uuid;
    interestId: Uuid;
    userId?: Uuid;
    createdAt: Date;
}

export interface ProfileLocation extends GenericObject {
    id: Uuid;
    key: ProfileLocationKeyType;
    profileId: Uuid;
    locationId: Uuid;
    userId?: Uuid;
    createdAt: Date;
}

export interface ProfileProfile extends GenericObject {
    id: Uuid;
    key: ProfileProfileKeyType;
    profileId: Uuid;
    otherProfileId: Uuid;
    userId?: Uuid;
    otherUserId?: Uuid;
    createdAt: Date;
}
  
export interface LocationInterest extends GenericObject {
    id: Uuid;
    key: LocationInterestKeyType;
    interestId: Uuid;
    locationId: Uuid;
    createdAt: Date;
}
  
export interface InterestInterest extends GenericObject {
    id: Uuid;
    key: InterestInterestKeyType;
    interestId: Uuid;
    otherInterestId: Uuid;
    createdAt: Date;
}
  
export interface LocationLocation extends GenericObject {
    id: Uuid;
    key: LocationLocationKeyType;
    locationId: Uuid;
    otherLocationId: Uuid;
    createdAt: Date;
}
