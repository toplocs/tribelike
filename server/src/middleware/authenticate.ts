import { Request, Response, NextFunction } from 'express';
import { session, users } from '../models/index';
import { SessionData } from '../models/Session';
import { User } from '@tribelike/types/User';

export interface AuthenticatedRequest extends Request {
    user: User,
    token?: string
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.loggedInUser?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized. User id not found' });

    /*const sessionData = await session.validateHeader(authHeader);
    if (!sessionData) return res.status(401).json({ error: 'Unauthorized. Token not valid' });
    */

    const user = await users.getById(userId);
    if (!user) return res.status(401).json({ error: 'Unauthorized. User not found' });
    
    next();
};
