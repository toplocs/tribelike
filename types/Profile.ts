import { Uuid } from "./Uuid";
import type { 
    ProfileProfileKeyType, 
    ProfileInterestKeyType, 
    ProfileLocationKeyType 
} from "./Relation";
import { GroupedInterests } from "./Interest";
import { GroupedLocations } from "./Location";
import { Activity } from "./Activity";

export type GroupedProfiles = {
    [key in ProfileProfileKeyType | ProfileLocationKeyType | ProfileInterestKeyType]: Profile[];
};

export interface Profile {
    id: Uuid;
    username: string;
    type: string;
    image?: string;
    email?: string;
    about?: string;
    userId?: Uuid;
    interests?: GroupedInterests;
    locations?: GroupedLocations;
    profiles?: GroupedProfiles;
    activities?: Activity[];
    settings?: ProfileSettings[];
}

export interface ProfileSettings {
    id: Uuid;
    name: string;
    pluginId?: Uuid;
    profileId: Uuid;
    active: boolean;
    settings: Record<string, any>;
}