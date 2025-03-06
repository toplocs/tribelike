import CryptoJS from 'crypto-js';
import { Request, Response } from 'express';
import { users } from '../models';
import { auth } from '../lib/auth';
import profiles from '../lib/profiles';
import { login } from '../lib/auth';

// V2: replaces api & actions
// TODO: Plays nice with passkeys

export class UserController {

  static async getUsers(req: Request, res: Response) {
    try {
      const usersList = await users.getAll();
      res.status(200).json(usersList);
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }

  static async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const user = await users.getById(id);
      if (user) return res.status(200).json(user);
      else return res.status(404).json({ error: 'User not found' });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }

  static async updateUser(req: Request, res: Response) {
    const formData = req.body;
    const authHeader = req.get('Authorization');
    try {
      const session = await auth(authHeader);
      const user = session?.user;
      const result = await users.update(user?.id, {
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
  static async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const result = await users.delete(id);
      if (result) return res.status(200).json({ success: 'User deleted' });
      else return res.status(404).json({ error: 'User not found' });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }
}
