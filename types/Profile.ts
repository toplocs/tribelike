export interface Profile {
    id: string;
    username: string;
    type: string;
    image: string;
    email: string;
    about?: string;
    userId?: string;
    interests: Interest[];
    locations: Location[];
    activities: Activity[];
    PluginSettings: PluginSettings[];
    Invite: Invite[];
    Profiles: ProfileProfile[];
    OtherProfiles: ProfileProfile[];
    ProfileLocations: ProfileLocation[];
    ProfileInterests: ProfileInterest[];
}
  
export interface Interest {
    id: string;
    title: string;
    language: string;
    profiles: Profile[];
    links: string[];
    ask: string[];
    invites: string[];
    access: number;
    relations: Relation[];
    activities: Activity[];
    discussions: Discussion[];
    Invite: Invite[];
    Interests: InterestInterest[];
    OtherInterests: InterestInterest[];
    ProfileInterest: ProfileInterest[];
    InterestLocation: InterestLocation[];
}
  
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
    locationId: string;
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
