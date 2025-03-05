import { Profile } from './Profile';

export interface User {
    id: string;
    username: string;
    email: string;
    image?: string;
    password: string;
    profiles: Profile[];
    settings?: Settings;
}
  
export interface Settings {
    id: string;
    userId: string;
    language: string;
}