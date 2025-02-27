import { Profile } from './Profile';
import { 
    Relation, 
    ProfileLocation, 
    InterestLocation, 
    LocationLocation 
} from './Relation';
import { 
    Activity, 
    Discussion,
    Invite 
} from './index';

export interface Location {
    id: string;
    title: string;
    xCoordinate?: string;
    yCoordinate?: string;
    latitude?: number;
    longitude?: number;
    geom?: Uint8Array;
    zoom?: number;
    profiles: Profile[];
    links: string[];
    ask: string[];
    invites: string[];
    access: number;
    relations: Relation[];
    activities: Activity[];
    discussions: Discussion[];
    Invite: Invite[];
    Locations: LocationLocation[];
    OtherLocations: LocationLocation[];
    ProfileLocation: ProfileLocation[];
    InterestLocation: InterestLocation[];
}
