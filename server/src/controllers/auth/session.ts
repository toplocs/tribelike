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

    if (!session) return res.status(401).json({ error: 'Unauthorized. Session not valid' });
    if (!('userId' in session.data)) {
        return res.status(401).json({ error: 'Unauthorized. User not Found' });
    }
    const loggedIn = session.data.userId != '';
    return res.status(200).json({ 
      userId: session!.data.userId,
      token: authToken,
      expires: session!.expires,
      loggedIn: loggedIn,
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