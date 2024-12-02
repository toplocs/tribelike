import type { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import {
  findInterests,
  createInterest,
  updateInterest,
  getInterestById,
  addInterest,
  removeInterest,
  addLink,
} from '../actions/interest';
import { createActivity } from '../actions/activity';

const router = express.Router();
const upload = multer();

router.route('/').get(async (req: Request, res: Response) => {
  const { success, error } = await findInterests(req.query);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
}).post(upload.none(), async (req: Request, res: Response) => {
  const { success, error } = await createInterest(req.body);
  console.log(success);
  if (success) {
    await createActivity({
      profileId: req.body?.profileId,
      text: `The interest ${success.title} was created!`,
      interests: [success.id],
    });
  }

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
}).put(upload.none(), async (req: Request, res: Response) => {
  const { success, error } = await updateInterest(req.body);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
})


router.route('/byId/:id').get(async (req: Request, res: Response) => {
  const { success, error } = await getInterestById(req.params);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});

router.route('/add').put(async (req: Request, res: Response) => {
  const { success, error } = await addInterest(req.body);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});

router.route('/remove').put(async (req: Request, res: Response) => {
  const { success, error } = await removeInterest(req.body);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});

router.route('/link').post(upload.none(), async (req: Request, res: Response) => {
  const { success, error } = await addLink(req.body);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});
export default router;