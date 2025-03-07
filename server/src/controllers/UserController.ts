import { Request, Response } from 'express';
import { users, profiles } from '../models';
import { AuthenticatedRequest } from '../middleware/authenticate';

export default class UserController {

  static async GetUsers(req: Request, res: Response) {
    try {
      const loggedInUser = (req as AuthenticatedRequest).user;
      if (loggedInUser.username !== 'admin') return res.status(403).json({ error: 'Forbidden' });

      const usersList = await users.getAll();
      res.status(200).json(usersList);
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }

  static async GetUserById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const loggedInUser = (req as AuthenticatedRequest).user;
      if (id !== loggedInUser.id) return res.status(403).json({ error: 'Forbidden' });

      let user = await users.getById(id);
      if (user) {
        user.profiles = await profiles.getAllByUserId(id);
        return res.status(200).json(user);
      } 
      else return res.status(404).json({ error: 'User not found' });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }

  static async UpdateUser(req: Request, res: Response) {
    const { id } = req.params;
    const formData = req.body;
    try {
      const loggedInUser = (req as AuthenticatedRequest).user;
      if (id !== loggedInUser.id) return res.status(403).json({ error: 'Forbidden' });

      const result = await users.update(id, {
        image: formData.image || '/images/default.jpeg',
        username: formData.username,
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
    const { id } = req.params;
    try {
      const loggedInUser = (req as AuthenticatedRequest).user;
      if (id !== loggedInUser.id) return res.status(403).json({ error: 'Forbidden' });

      const result = await users.delete(id);
      if (result) return res.status(200).json({ success: 'User deleted' });
      else return res.status(404).json({ error: 'User not found' });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }
}
