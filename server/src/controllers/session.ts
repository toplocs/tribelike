import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../middleware/error';
import { session, } from '../models';

export const handleGetSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
    const authHeader = req.get('Authorization');
    let authToken = authHeader as string;
    if (!authToken) {
      const { token } = await session.createToken('');
      authToken = token;
    }
    const userId = await session.validateToken(authToken);

    return res.status(200).json({ 
      userId: userId,
      token: authToken,
    });
  } catch(e: any) {
    console.error(e);
    return res.status(400).json(e.error);
  }
}