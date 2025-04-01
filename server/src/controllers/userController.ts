import { Request, Response } from 'express';
import { users, profiles } from '../models';
import { AuthenticatedRequest } from '../middleware/authenticate';

export default class UserController {

  static async GetUsers(req: Request, res: Response) {
    try {
      return res.status(403).json({ error: 'Forbidden' });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }

  static async GetUser(req: Request, res: Response) {
    try {
      const authReq = req as unknown as AuthenticatedRequest;
      const { userId } = authReq.auth;

      let user = await users.getById(userId);
      if (user) {
        user.profiles = await profiles.getAllByUserId(userId);
        return res.status(200).json(user);
      } 
      else return res.status(404).json({ error: 'User not found' });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }

  static async UpdateUser(req: Request, res: Response) {
    const formData = req.body;
    try {
      const authReq = req as unknown as AuthenticatedRequest;
      const { userId } = authReq.auth;

      const result = await users.update(userId, {
        image: formData.image || '/images/default.jpeg',
        email: formData.email,
      });

      if (result) return res.status(200).json(result);
      else return res.status(404).json({ error: 'User not found' });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }

  // TODO: Cascading delete   
  static async DeleteUser(req: Request, res: Response) {
    try {
      const authReq = req as unknown as AuthenticatedRequest;
      const { userId } = authReq.auth;

      const result = await users.delete(userId);
      if (result) return res.status(200).json({ success: 'User deleted' });
      else return res.status(404).json({ error: 'User not found' });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }
}
