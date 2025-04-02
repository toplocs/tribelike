import type { Request, Response } from 'express';
import express from 'express';
import {
  findRelations,
  addRelation,
  removeRelation
} from '../actions/relation';

const router = express.Router();

router.route('/').get(async (req: Request, res: Response) => {
  const { success, error } = await findRelations(req.query);

  if (success)
    res.status(200).json(success);
  else 
    res.status(400).json(error);
}).put(async (req: Request, res: Response) => {
  const { success, error } = await addRelation(req.body);

  if (success)
    res.status(200).json(success);
  else 
    res.status(400).json(error);
}).delete(async (req: Request, res: Response) => {
  const { success, error } = await removeRelation(req.body);

  if (success)
    res.status(200).json(success);
  else 
    res.status(400).json(error);
})

export default router;