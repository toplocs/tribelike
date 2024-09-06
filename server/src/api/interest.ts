import type { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import {
  findInterests,
  createInterest,
  addInterest,
  removeInterest
} from '../actions/interest';

const router = express.Router();
const upload = multer();

router.route('/').get(async (req: Request, res: Response) => {
  const { success, error } = await findInterests(req.query);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
})
.post(upload.none(), async (req: Request, res: Response) => {
  console.log(req.body);
  const { success, error } = await createInterest(req.body);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});

router.route('/add').put(async (req: Request, res: Response) => {
  const { success, error } = await addInterest(req.body);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});

router.route('/remove').put(async (req: Request, res: Response) => {
  const { success, error } = await removeInterest(req.body);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});


export default router;