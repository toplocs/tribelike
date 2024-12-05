import type { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import prisma from '../lib/prisma';
import {
  findLocations,
  createLocation,
  updateLocation,
  getLocationById,
  addLocation,
  removeLocation,
  askAccess,
  addLink,
} from '../actions/location';
import { createActivity } from '../actions/activity';
import { createDiscussion } from '../actions/discussion';

const router = express.Router();
const upload = multer();

router.route('/').get(async (req: Request, res: Response) => {
  const { success, error } = await findLocations(req.query);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
}).post(upload.none(), async (req: Request, res: Response) => {
  const { success, error } = await createLocation(req.body);
  console.log(req.body?.profileId);
  if (success) {
    await createActivity({
      profileId: req.body?.profileId,
      text: `The location ${success.title} was created!`,
      locationId: success.id,
    });
  }

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
}).put(upload.none(), async (req: Request, res: Response) => {
  const { success, error } = await updateLocation(req.body);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});

router.route('/byId/:id').get(async (req: Request, res: Response) => {
  const { success, error } = await getLocationById(req.params);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});

router.route('/add').put(async (req: Request, res: Response) => {
  const { success, error } = await addLocation(req.body);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});

router.route('/remove').put(async (req: Request, res: Response) => {
  const { success, error } = await removeLocation(req.body);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});

router.route('/ask').put(async (req: Request, res: Response) => {
  const { title, limit } = await askAccess(req.body);
  const profile = await prisma.profile.findUnique({
    where: { id: req.body.profileId },
  });
  await createDiscussion({
    type: 'askAccess',
    text: `${profile?.username} asks to join the ${title} community`,
    limit: limit,
    votes: { yes: 0, no: 0 },
    attachment: profile,
    locationId: req.body.locationId,
  });

  return res.status(200).json(true);
});



router.route('/link').post(upload.none(), async (req: Request, res: Response) => {
  const { success, error } = await addLink(req.body);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});

export default router;