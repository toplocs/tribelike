import { Request, Response, NextFunction } from 'express';
import { sessions } from '../../models';

export const handleGetSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
    const authHeader = req.get('Authorization');
    let authToken = authHeader as string;
    if (!authToken) {
      const { token } = await sessions.createToken({
        userId: '',
      });
      authToken = token;
    }
    const userId = await sessions.validateToken(authToken);

    return res.status(200).json({ 
      userId: userId,
      token: authToken,
    });
  } catch(e: any) {
    console.error(e);
    return res.status(400).json(e.error);
  }
}

export const handleLogout = async (req: Request, res: Response) => {
  try {
    // Todo: Invalidate the session token
  } catch (error) {
    res.status(500).send({ message: 'Logout failed', error });
  }
};