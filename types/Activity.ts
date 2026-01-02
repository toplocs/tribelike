import type { Uuid } from './Uuid';
import type { Interest } from './Interest';
import type { Location } from './Location';

export interface Activity {
    id: Uuid;
    text: string;
    href?: string;
    status: Status;
    type: Type;
    date: Date;
    profileId: Uuid;
    location?: Location;
    interest?: Interest;
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