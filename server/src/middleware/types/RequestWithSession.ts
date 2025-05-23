import { Request } from 'express';
import { Uuid } from '@tribelike/types/Uuid';

export interface RequestWithSession extends Request {
    session: {
        userId: Uuid;
        loggedIn: boolean;
        token: string;
        expires: Date;
    }
}