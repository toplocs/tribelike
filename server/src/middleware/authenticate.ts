import { Request, Response, NextFunction } from 'express';
import { session, users } from '../models/index';
import { Uuid } from '@tribelike/types/Uuid';

export interface AuthenticatedRequest extends Request {
    userId: Uuid,
    token?: string
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.get('Authorization');    
    if (!token) return res.status(401).json({ error: 'Unauthorized. Authorization Header not found' });

    const userId = await session.validateToken(token);
    if (!userId) return res.status(401).json({ error: 'Unauthorized. Session not valid' });

    (req as AuthenticatedRequest).userId = userId;
    (req as AuthenticatedRequest).token = token;
    next();
};
