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
    if (formData.username.length < 3) return res.status(401).json('This account does not exist');
    const user = await prisma.user.findUnique({
      where: {
        username: formData.username,
      }
    });
    if (!user) return res.status(401).json('This account does not exist');
    // if (formData.password != user.password) return res.status(401).json('The password is not correct');

    const { token, expires } = await login(user);
    console.log('Login successfull');
    
    return res.status(200).json({ token, expires });
  } catch(e: any) {
    console.error(e);
    return res.status(400).json(e.error);
  }
});

router.route('/logout').get(async (req: Request, res: Response) => {
  const authHeader = req.get('Authorization');
  const session = await auth(authHeader);
  await logout();

  return res.status(200).json({ session });
});

router.route('/refresh').post(upload.none(), async (req: Request, res: Response) => {
  return res.status(400).json({ error: 'Failed to refresh token' });
});



export default router;