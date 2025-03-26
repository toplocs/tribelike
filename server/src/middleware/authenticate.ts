import { Request, Response, NextFunction } from 'express';
import { session, users } from '../models/index';
import { Uuid } from '@tribelike/types/Uuid';

export interface AuthenticatedRequest extends Request {
    userId: Uuid,
    token?: string
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized. Authorization Header not found' });

    const sessionData = await session.validateHeader(authHeader);
    if (!sessionData) return res.status(401).json({ error: 'Unauthorized. Session not valid' });
    if (!sessionData.token) return res.status(401).json({ error: 'Unauthorized. Token not valid' });
    if (!sessionData.userId) return res.status(401).json({ error: 'Unauthorized. User not found' });

    (req as AuthenticatedRequest).userId = sessionData.userId;
    (req as AuthenticatedRequest).token = sessionData.token;
    next();
};
