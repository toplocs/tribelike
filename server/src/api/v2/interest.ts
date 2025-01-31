import type { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import {
  findInterestRelations,
  findLocationRelations,
  createInterestRelation,
  createLocationRelation,
} from '../../actions/interest-relations';

const router = express.Router();
const upload = multer();

router.route('/interests/:id').get(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { success, error } = await findInterestRelations(id);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
}).post(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { success, error } = await createInterestRelation(id, req.body);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});

router.route('/locations/:id').get(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { success, error } = await findLocationRelations(id);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
}).post(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { success, error } = await createLocationRelation(id, req.body);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});


export default router;