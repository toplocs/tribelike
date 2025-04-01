import type { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import prisma from '../lib/prisma';
import {
  findInterests,
  createInterest,
  updateInterest,
  getInterestById,
  addInterest,
  removeInterest,
  askAccess,
  inviteFriends,
  addLink,
} from '../actions/interest';
import { createActivity } from '../actions/activity';
import { createDiscussion } from '../actions/discussion';

const router = express.Router();
const upload = multer();

router.route('/').get(async (req: Request, res: Response) => {
  const { success, error } = await findInterests(req.query);

  if (success) 
    res.status(200).json(success);
  else 
    res.status(400).json(error);
}).post(upload.none(), async (req: Request, res: Response) => {
  const { success, error } = await createInterest(req.body);
  if (success) {
    await createActivity({
      profileId: req.body?.profileId,
      text: `The interest ${success.title} was created!`,
      interestId: success.id,
    });
  }

  if (success) 
    res.status(200).json(success);
  else 
    res.status(400).json(error);
}).put(upload.none(), async (req: Request, res: Response) => {
  const { success, error } = await updateInterest(req.body);

  if (success) 
    res.status(200).json(success);
  else 
    res.status(400).json(error);
})


router.route('/byId/:id').get(async (req: Request, res: Response) => {
  const { success, error } = await getInterestById(req.params);

  if (success) 
    res.status(200).json(success);
  else 
    res.status(400).json(error);
});

router.route('/add').put(async (req: Request, res: Response) => {
  const { success, error } = await addInterest(req.body);

  if (success) 
    res.status(200).json(success);
  else 
    res.status(400).json(error);
});

router.route('/remove').put(async (req: Request, res: Response) => {
  const { success, error } = await removeInterest(req.body);

  if (success) 
    res.status(200).json(success);
  else 
    res.status(400).json(error);
});

router.route('/ask').put(async (req: Request, res: Response) => {
  const result = await askAccess(req.body);
  if (result) {
    const profile = await prisma.profile.findUnique({
      where: { id: req.body.profileId },
    });
    await createDiscussion({
      type: 'askAccess',
      text: `${profile?.username} asks to join the ${result.title} community`,
      limit: result.limit,
      votes: { yes: 0, no: 0 },
      attachment: profile,
      interestId: req.body.interestId,
    });
  }

  res.status(200).json(true);
});

router.route('/invite').put(async (req: Request, res: Response) => {
  const result = await inviteFriends(req.body);
  if (result) {
    for (let id of result.invites) {
      await prisma.invite.create({
        data: {
          profileId: id,
          interestId: req.body.interestId,
        }
      });
    }
  }

  res.status(200).json(true);
});


router.route('/link').post(upload.none(), async (req: Request, res: Response) => {
  const { success, error } = await addLink(req.body);

  if (success) 
    res.status(200).json(success);
  else 
    res.status(400).json(error);
});

export default router;