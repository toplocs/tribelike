import type { Request, Response } from 'express';
import express from 'express';
import {
  findDiscussions,
  voteYes,
  voteNo,
} from '../actions/discussion';

const router = express.Router();

router.route('/:id').get(async (req: Request, res: Response) => {
  const { success, error } = await findDiscussions(req.params);

  if (success)
    res.status(200).json(success);
  else 
    res.status(400).json(error);
});

router.route('/vote/yes').put(async (req: Request, res: Response) => {
  const { success, error } = await voteYes(req.body);

  if (success) 
    res.status(200).json(success);
  else 
    res.status(400).json(error);
});

router.route('/vote/no').put(async (req: Request, res: Response) => {
  const { success, error } = await voteNo(req.body);

  if (success) 
    res.status(200).json(success);
  else 
    res.status(400).json(error);
});

export default router;