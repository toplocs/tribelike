import type { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import {
  findLocations,
  createLocation,
  addLocation,
} from '../actions/location';

const router = express.Router();
const upload = multer();

router.route('/').get(async (req: Request, res: Response) => {
  const { success, error } = await findLocations(req.query);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
})
.post(upload.none(), async (req: Request, res: Response) => {
  const { success, error } = await createLocation(req.body);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});

router.route('/add').put(async (req: Request, res: Response) => {
  const authHeader = req.get('Authorization');
  const { success, error } = await addLocation(req.body, authHeader);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});

export default router;