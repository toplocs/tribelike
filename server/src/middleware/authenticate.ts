import { Request, Response, NextFunction } from 'express';
import { Uuid } from '@tribelike/types/Uuid';
import { sessions } from '../models';

export interface AuthenticatedRequest extends Request {
    userId: Uuid;
    token: string;
    expires: Date;
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

    (req as AuthenticatedRequest).token = token;
    (req as AuthenticatedRequest).userId = session.data.userId;
    (req as AuthenticatedRequest).expires = session.expires;
    next();
};
