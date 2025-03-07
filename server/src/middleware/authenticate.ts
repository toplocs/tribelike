import { Request, Response, NextFunction } from 'express';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const user = req.session.loggedInUser;
    console.log('Auth: ', user?.id, authHeader);
    
    if (authHeader && user) {
        const token = authHeader.split(' ')[1];
        if (token === 'valid-token') {
            next();
        } else {
            res.status(403).send({ message: 'Forbidden' });
        }
    } else {
        res.status(401).send({ message: 'Unauthorized' });
    }
};
