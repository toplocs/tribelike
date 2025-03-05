import { Profile } from './Profile';
import { 
    Relation, 
    ProfileInterest, 
    InterestInterest, 
    InterestLocation 
} from './Relation';
import { Invite, Activity, Discussion } from './index';


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
  
export type Topic = Interest;
