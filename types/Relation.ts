import { Interest } from './Topic';
import { Location } from './Location';
import { Profile } from './Profile';

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


export interface ProfileInterest {
    id: string;
    key: ProfileInterestKeyType;
    profileId: string;
    interestId: string;
    createdAt: Date;
}

export interface ProfileLocation {
    id: string;
    key: ProfileLocationKeyType;
    profileId: string;
    Profile?: Profile;
    locationId: string;
    Location?: Location;
    createdAt: Date;
}

export interface ProfileProfile {
    id: string;
    key: ProfileProfileKeyType;
    profileId: string;
    otherProfileId: string;
    createdAt: Date;
}
  
export interface LocationInterest {
    id: string;
    key: LocationInterestKeyType;
    interestId: string;
    locationId: string;
    createdAt: Date;
}
  
export interface InterestInterest {
    id: string;
    key: InterestInterestKeyType;
    interestId: string;
    otherInterestId: string;
    createdAt: Date;
}
  
export interface LocationLocation {
    id: string;
    key: LocationLocationKeyType;
    locationId: string;
    otherLocationId: string;
    createdAt: Date;
}
