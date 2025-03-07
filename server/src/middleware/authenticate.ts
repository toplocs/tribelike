import { Request, Response, NextFunction } from 'express';
import { session, users } from '../models/index';
import { SessionData } from '../models/Session';
import { User } from '@tribelike/types/User';

export interface AuthenticatedRequest extends Request {
    user: User,
    token?: string
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized. Authorization Header not found' });

    const sessionData = await session.validateHeader(authHeader);
    if (!sessionData) return res.status(401).json({ error: 'Unauthorized. Token not valid' });

    const user = await users.getById(sessionData.userId);
    if (!user) return res.status(401).json({ error: 'Unauthorized. User not found' });

    (req as AuthenticatedRequest).user = user;
    (req as AuthenticatedRequest).token = sessionData.token;
    next();
};
