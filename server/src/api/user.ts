import type { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import {
  getUsers,
  createUser,
  updateUser,
  getUserById,
} from '../actions/user';

const router = express.Router();
const upload = multer();

router.route('/').get(async (req: Request, res: Response) => {
  const { success, error } = await getUsers(req.query);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
})
.post(upload.none(), async (req: Request, res: Response) => {
  const { success, error } = await createUser(req.body);

	if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
})
.put(upload.none(), async (req: Request, res: Response) => {
  const authHeader = req.get('Authorization');
  const { success, error } = await updateUser(req.body, authHeader);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
})

router.route('/byId/:id').get(async (req: Request, res: Response) => {
 const { success, error } = await getUserById(req.params);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
})

export default router;