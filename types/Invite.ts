import { Uuid } from './Uuid';
  
export interface Invite {
    id: Uuid;
    createdAt: Date;
    profileId: Uuid;
    interestId?: Uuid;
    locationId?: Uuid;
}
  