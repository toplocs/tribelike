import CryptoJS from 'crypto-js';
import { Request, Response } from 'express';
import { users } from '../models/User';
import { auth } from '../lib/auth';
import profiles from '../lib/profiles';
import { login } from '../lib/auth';

// V2: replaces api & actions
// TODO: Plays nice with passkeys

export class UserController {

  static async getUsers(req: Request, res: Response) {
    try {
      const usersList = await users.getAll();
      res.status(200).json({ success: usersList });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }

  static async createUser(req: Request, res: Response) {
    const formData = req.body;
    try {
      if (formData.username.length < 3) throw new Error('Your username is too short');
      if (formData.email.length < 3) throw new Error('Your email is too short');
      if (formData.password != formData.password2) throw new Error('The password confirmation failed');
      const email = formData.email.trim().toLowerCase();
      const hash = CryptoJS.SHA256(email).toString(CryptoJS.enc.Hex);
      const image = `https://gravatar.com/avatar/${hash}`;
      const user = await users.create({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      for (let profile of profiles) {
        await prisma.profile.create({
          data: {
            userId: user.id,
            username: formData.username,
            email: formData.email,
            image: image,
            ...profile,
          }
        });
      }
      const { token, expires } = await login(user);
      res.status(200).json({ token, expires });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }

  static async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const user = await users.getById(id);
      res.status(200).json({ success: user });
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
      res.status(200).json({ success: result });
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
      res.status(200).json({ success: result });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }
}
