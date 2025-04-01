import { Request, Response, NextFunction } from 'express';
import { RequestWithSession } from '.';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const request = req as unknown as RequestWithSession;
    if (!request.auth.loggedIn) {
        return res.status(401).json({ error: 'Unauthorized. User not logged in' });
    }
    next();
};
