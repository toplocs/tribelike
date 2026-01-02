import type { GenericObject, Uuid } from './Uuid';
import type { Profile } from './Profile';

export interface User extends GenericObject {
    id: Uuid;
    email: string;
    emailVerified?: boolean;
    image?: string;
    profiles?: Profile[];
    settings?: UserSetting[];
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