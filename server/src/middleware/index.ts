import { Request } from 'express';
import { Uuid } from '@tribelike/types/Uuid';

export interface RequestWithSession extends Request {
    auth: {
        userId: Uuid;
        loggedIn: boolean;
        token: string;
        expires: Date;
    }
}

export * from './error';
export * from './session';
export * from './authenticate';