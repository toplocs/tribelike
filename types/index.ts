import { Profile } from './Profile';
import { Interest } from './Topic';
import { Location } from './Location';

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
  
export interface Discussion {
    id: string;
    type: string;
    text: string;
    limit: number;
    voters: string[];
    votes: any;
    attachment: any;
    createdAt: Date;
    Interest?: Interest;
    interestId?: string;
    Location?: Location;
    locationId?: string;
}
  
export interface Invite {
    id: string;
    createdAt: Date;
    profileId: string;
    Profile: Profile;
    Interest?: Interest;
    interestId?: string;
    Location?: Location;
    locationId?: string;
}
  
export interface Activity {
    id: string;
    text: string;
    href?: string;
    status: Status;
    type: Type;
    date: Date;
    profileId: string;
    profile: Profile;
    locationId?: string;
    location?: Location;
    interestId?: string;
    interest?: Interest;
}
  
export interface PluginSettings {
    id: string;
    name: string;
    path: string;
    key: string;
    pluginId: string;
    profileId: string;
    profile: Profile;
    active: boolean;
    settings: any[];
}

export enum Type {
    NORMAL,
    DISCUSSION,
    POLL,
    GOVERNANCE,
    EVENT
}
  
export enum Status {
    IMPORTANT,
    ONGOING,
    LEARNING,
    TEACHING,
    INTERESTED,
    FAVOURITE,
    CURRENTLY_AT,
    GOING_NEXT
}