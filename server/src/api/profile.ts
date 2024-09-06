import type { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import {
  findProfiles,
  createProfile,
  changeProfile,
} from '../actions/profile';

const router = express.Router();
const upload = multer();

router.route('/').get(async (req: Request, res: Response) => {
  const { success, error } = await findProfiles(req.query);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
})
.post(upload.none(), async (req: Request, res: Response) => {
  const { success, error } = await createProfile(req.body);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
})
.put(upload.none(), async (req: Request, res: Response) => {
  console.log(req.body)
  const { success, error } = await changeProfile(req.body);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});



export default router;