import { Router } from 'express';
import v2interestRouter from '../../api/v2/interest';
import v2locationRouter from '../../api/v2/location';
import v2profileRouter from '../../api/v2/profile';

import magicLinkRouter from './magicLinkRouter';
import passkeyRouter from './passkeyRouter';
import userRouter from './userRouter';
import profileRouter from './profileRouter';

const router = Router();
router.use('/',
  magicLinkRouter,
  passkeyRouter, 
  userRouter, 
  profileRouter
);

router.use('/interest', v2interestRouter);
router.use('/location', v2locationRouter);
router.use('/profile', v2profileRouter);

export default router;
