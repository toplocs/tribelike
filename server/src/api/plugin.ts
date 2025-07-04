import type { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import { 
  findPluginSettings,
  togglePluginActive,
 } from '../actions/plugin';

const router = express.Router();
const upload = multer();

router.route('/').get(async (req: Request, res: Response) => {
  const { success, error } = await findPluginSettings(req.query);

  if (success) 
    res.status(200).json(success);
  else 
    res.status(400).json(error);
});

router.route('/active').post(upload.none(), async (req: Request, res: Response) => {
  const { success, error } = await togglePluginActive(req.body);

  if (success) 
    res.status(200).json(success);
  else 
    res.status(400).json(error);
});

router.route('/settings').post(upload.none(), async (req: Request, res: Response) => {
  const { success, error } = await togglePluginActive(req.body);

  if (success) 
    res.status(200).json(success);
  else 
    res.status(400).json(error);
})

export default router;