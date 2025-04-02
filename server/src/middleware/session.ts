import { Request, Response, NextFunction } from 'express';
import { RequestWithSession } from './types/RequestWithSession';
import { sessions } from '../models';

export const session = async (req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/api/auth/session') return next();
    if (req.path === '/api/session') return next();
    if (req.path.startsWith('/api/auth/magicLink')) return next();

    const token = req.get('Authorization');
    if (!token) return res.status(401).json({ error: 'Unauthorized. Authorization Header not found' });

    const session = await sessions.validateToken(token);
    if (!session) return res.status(401).json({ error: 'Unauthorized. Session not valid' });
    
    if (!('userId' in session.data)) {
        return res.status(401).json({ error: 'Unauthorized. User not Found' });
    }
    
    const loggedIn = session.data.userId != '';

    (req as unknown as RequestWithSession).auth = {
        userId: session.data.userId,
        loggedIn: loggedIn,
        token: token,
        expires: session.expires
    }
    next();
};
