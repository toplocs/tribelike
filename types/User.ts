import { Profile } from './Profile';

export interface User {
    id: string;
    username: string;
    email: string;
    image?: string;
    password: string;
    profiles: Profile[];
    settings?: ProfileSettings;
}
  
export interface ProfileSettings {
    id: string;
    userId: string;
    language: string;
}
