import type { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import prisma from '../lib/prisma';
import { auth, login, logout } from '../lib/auth';

const router = express.Router();
const upload = multer();

router.route('/').get(async (req: Request, res: Response) => {
  try {
    const authHeader = req.get('Authorization');
    const session = await auth(authHeader);

    return res.status(200).json({ session });
  } catch(e: any) {
    console.error(e);
    return res.status(400).json(e.error);
  }
});

router.route('/login').post(upload.none(), async (req: Request, res: Response) => {
  try {
    const formData = req.body;
    const user = await prisma.user.findUnique({
      where: {
        username: formData.username,
      }
    });
    if (!user) return res.status(401).json('Dieser Benutzer existiert nicht');
    if (formData.password != user.password) return res.status(401).json('Das Passwort ist inkorrekt');

    const { token, expires } = await login(user);
    return res.status(200).json({ token, expires });
  } catch(e: any) {
    console.error(e);
    return res.status(400).json(e.error);
  }
});

router.route('/logout').post(upload.none(), async (req: Request, res: Response) => {
  await logout();
  res.json({ message: 'Logged out' });
});

router.route('/refresh').post(upload.none(), async (req: Request, res: Response) => {
  return res.status(400).json({ error: 'Failed to refresh token' });
});



export default router;