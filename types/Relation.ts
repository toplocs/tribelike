import { Interest } from './Topic';
import { Location } from './Location';
import { Profile } from './Profile';

export interface Relation {
    id: string;
    key: string;
    type: string;
    data: any;
    Interest?: Interest;
    interestId?: string;
    Location?: Location;
    locationId?: string;
}
  
export interface ProfileInterest {
    id: string;
    key: string;
    profileId: string;
    interestId: string;
    createdAt: Date;
}

export interface ProfileLocation {
    id: string;
    key: string;
    profileId: string;
    Profile?: Profile;
    locationId: string;
    Location?: Location;
    createdAt: Date;
}

export interface ProfileProfile {
    id: string;
    key: string;
    profileId: string;
    otherProfileId: string;
    createdAt: Date;
}
  
export interface InterestLocation {
    id: string;
    key: string;
    interestId: string;
    locationId: string;
    createdAt: Date;
}
  
export interface InterestInterest {
    id: string;
    key: string;
    interestId: string;
    otherInterestId: string;
    createdAt: Date;
}
  
export interface LocationLocation {
    id: string;
    key: string;
    locationId: string;
    otherLocationId: string;
    createdAt: Date;
}
