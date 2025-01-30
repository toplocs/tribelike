import type { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import {

} from '../../actions/interest';

const router = express.Router();
const upload = multer();


//--- Relations--- //
router.route('/interests/:id').post(async (req: Request, res: Response) => {
  return res.status(200).json(true);
});

router.route('/locations/:id').post(async (req: Request, res: Response) => {
  return res.status(200).json(true);
});


export default router;