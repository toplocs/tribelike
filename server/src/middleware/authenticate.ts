import { Request, Response, NextFunction } from 'express';
import { RequestWithSession } from './types/RequestWithSession';

export const authenticate = async (req: RequestWithSession, res: Response, next: NextFunction) => {
    if (req.method === "OPTIONS") {
        next();
    }
    if (!req.session.loggedIn) {
        res.status(401).json({ error: 'Unauthorized. User not logged in' });
        return;
    }
    next();
};
