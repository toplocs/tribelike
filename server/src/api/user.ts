import type { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import { createUser } from '../actions/user';

const router = express.Router();
const upload = multer();

router.route('/')
/*.get(async (req: Request, res: Response) => {
  const { success, error } = await findUser(req.query);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
})*/
.post(upload.none(), async (req: Request, res: Response) => {
  const { success, error } = await createUser(req.body);

	if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});

router.route('/:id').put(() => {

})
.delete(() => {

})

export default router;