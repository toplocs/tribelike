import { Request, Response, NextFunction } from 'express';
import { users, magicLinks } from '../models';

export const handleMagicLinkLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const userId = await magicLinks.isValid(token);
    if (userId) {
        const user = await users.getById(userId);
        console.log(user);
    }
}

export const handleLogout = async (req: Request, res: Response) => {
  try {
    // Todo: Invalidate the session token
  } catch (error) {
    res.status(500).send({ message: 'Logout failed', error });
  }
};