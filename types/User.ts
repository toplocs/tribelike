import { GenericObject, Uuid } from './Uuid';
import { Profile } from './Profile';

export interface User extends GenericObject {
    id: Uuid;
    email: string;
<<<<<<< HEAD
    emailVerified: boolean;
=======
    emailVerified?: boolean;
    image?: string;
>>>>>>> 0f74f05daf917f8b935ff614e1352d500237d7b2
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