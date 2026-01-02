import type { Uuid } from './Uuid';
import type { GroupedProfiles } from './Profile';
import type {
    ProfileInterestKeyType,
    LocationInterestKeyType,
    InterestInterestKeyType
} from './Relation';
import type { Activity } from './Activity';
import type { Discussion } from './Discussion';
import type { GroupedLocations } from './Location';

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
