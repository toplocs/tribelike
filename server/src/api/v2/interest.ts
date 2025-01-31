import type { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import {
  findInterestRelations,
  createInterestRelation,
  createLocationRelation,
} from '../../actions/interest-relations';

const router = express.Router();
const upload = multer();

router.route('/interests/:id').get(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(req.query);
  /*const { success, error } = await findInterestRelations(id, req.query);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);*/
});

router.route('/interests/:id').post(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { success, error } = await createInterestRelation(id, req.body);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});

router.route('/locations/:id').post(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { success, error } = await createLocationRelation(id, req.body);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});


export default router;