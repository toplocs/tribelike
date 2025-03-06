import { Uuid } from './Uuid';
import { Profile } from './Profile';

export interface User {
    id: Uuid;
    username: string;
    email: string;
    profiles: Profile[];
    settings: UserSetting[];
    image?: string;
}
  
export interface UserSetting {
    id: Uuid;
    userId: Uuid;
    settings: Record<string, any>;
}
