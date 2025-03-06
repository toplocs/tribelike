import { Uuid } from './Uuid';
import { GroupedProfiles } from './Profile';
import type {
    ProfileInterestKeyType,
    LocationInterestKeyType,
    InterestInterestKeyType
} from './Relation';
import { Activity, Discussion } from './Invite';
import { GroupedLocations } from './Location';

export type GroupedInterests = {
    [key in ProfileInterestKeyType | LocationInterestKeyType | InterestInterestKeyType]: Interest[];
};

export interface Interest {
    id: Uuid;
    title: string;
    links: string[];
    ask: string[];
    invites: string[];
    access: number;
    activities: Activity[];
    discussions: Discussion[];
    profiles?: GroupedProfiles;
    interests?: GroupedInterests;
    locations?: GroupedLocations;
}
