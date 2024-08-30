import type { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import { findProfiles, createProfile } from '../actions/profile';

const router = express.Router();
const upload = multer();

router.route('/').get(async (req: Request, res: Response) => {
  const { success, error } = await findProfiles(req.query);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
})
.post(upload.none(), async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const { success, error } = await createProfile(userId, req.body);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});


export default router;