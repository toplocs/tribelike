import { Router } from 'express';
import v2interestRouter from '../../api/v2/interest';
import v2locationRouter from '../../api/v2/location';
import v2profileRouter from '../../api/v2/profile';

import magicLinkRouter from './magicLinkRouter';
import passkeyRouter from './passkeyRouter';
import userRouter from './userRouter';
import profileRouter from './profileRouter';
import sessionRouter from './sessionRouter';

import pluginRouter from './pluginRouter';

const router = Router();
router.use('/',
  sessionRouter,
  magicLinkRouter,
  passkeyRouter, 
  userRouter, 
  profileRouter,
  pluginRouter,
);

router.use('/interest', v2interestRouter);
router.use('/location', v2locationRouter);
router.use('/profile', v2profileRouter);

router.use('/plugins', pluginRouter);

export default router;
