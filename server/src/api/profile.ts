import type { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import {
  getProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
} from '../actions/profile';

const router = express.Router();
const upload = multer();

router.route('/').get(async (req: Request, res: Response) => {
  const authHeader = req.get('Authorization');
  const { success, error } = await getProfiles(authHeader);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
})
.post(upload.none(), async (req: Request, res: Response) => {
  const { success, error } = await createProfile(req.body);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
})
.put(upload.none(), async (req: Request, res: Response) => {
  const authHeader = req.get('Authorization');
  const { success, error } = await updateProfile(req.body, authHeader);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
})
.delete(async (req: Request, res: Response) => {
  const authHeader = req.get('Authorization');
  const { success, error } = await deleteProfile(req.query, authHeader);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});



export default router;