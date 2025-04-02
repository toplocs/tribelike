import { Request, Response, NextFunction } from 'express';
<<<<<<< HEAD
import { Uuid } from '@tribelike/types/Uuid';
import { sessions } from '../models';

export interface AuthenticatedRequest extends Request {
    auth: {
        userId: Uuid;
        token: string;
        expires: Date;
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.get('Authorization'); 
    if (!token) return res.status(401).json({ error: 'Unauthorized. Authorization Header not found' });

    const session = await sessions.validateToken(token);
    if (!session) return res.status(401).json({ error: 'Unauthorized. Session not valid' });
    
    // Check if session.data is of type AuthSessionData
    if (!('userId' in session.data)) {
        return res.status(401).json({ error: 'Unauthorized. User not Found' });
    }
    
    if (!session.data.userId) return res.status(401).json({ error: 'Unauthorized. User not found' });

    (req as unknown as AuthenticatedRequest).auth = {
        token: token,
        userId: session.data.userId,
        expires: session.expires
    }
=======
import { RequestWithSession } from './types/RequestWithSession';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const request = req as unknown as RequestWithSession;
    if (!request.auth.loggedIn) {
        return res.status(401).json({ error: 'Unauthorized. User not logged in' });
    }
>>>>>>> 0f74f05daf917f8b935ff614e1352d500237d7b2
    next();
    //todo: put it in the session!
};
