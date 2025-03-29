import { GenericObject, Uuid } from './Uuid';
import { Profile } from './Profile';

export interface User extends GenericObject {
    id: Uuid;
    email: string;
    profiles?: Profile[];
    settings?: UserSetting[];
    image?: string;
}

export interface UserSetting extends GenericObject {
    id: Uuid;
    userId: Uuid;
    settings: Record<string, any>;
}

export interface MagicLink extends GenericObject {
    id: Uuid;
    token: string;
    userId: Uuid;
    expires: Date;
}