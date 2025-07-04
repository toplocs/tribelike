import type { Request, Response } from 'express';
import express from 'express';
import { findActivities } from '../actions/activity';

const router = express.Router();

router.route('/').get(async (req: Request, res: Response) => {
  const { success, error } = await findActivities(req.query);

  if (success) {
    res.status(200).json(success);
  } else {
    res.status(400).json(error);
  }
})

export default router;