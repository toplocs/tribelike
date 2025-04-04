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
    const session = await sessions.validateToken(authToken);

    if (!session) {
      res.status(401).json({ error: 'Unauthorized. Session not valid' });
      return;
    }
    if (!('userId' in session.data)) {
        res.status(401).json({ error: 'Unauthorized. User not Found' });
        return;
    }
    const loggedIn = session.data.userId != '';
    res.status(200).json(session);
  } catch(e: any) {
    console.error(e);
    res.status(400).json(e.error);
  }
}

export const handleLogout = async (req: Request, res: Response) => {
  try {
    // Todo: Invalidate the session token
  } catch (error) {
    res.status(500).send({ message: 'Logout failed', error });
  }
};