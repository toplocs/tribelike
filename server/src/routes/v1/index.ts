import { Router } from 'express';
import activityRouter from '../../api/activity';
import discussionRouter from '../../api/discussion';
import interestRouter from '../../api/interest';
import locationRouter from '../../api/location';
import pluginRouter from '../../api/plugin';
import relationRouter from '../../api/relation';

// import authRouter from '../../api/auth';
// import userRouter from '../../api/user';
// import profileRouter from '../../api/profile';

const router = Router();
router.use('/activity', activityRouter);
router.use('/discussion', discussionRouter);
router.use('/interest', interestRouter);
router.use('/location', locationRouter);
router.use('/plugin', pluginRouter);
router.use('/relation', relationRouter);

// router.use('/auth', authRouter);
// router.use('/user', userRouter);
// router.use('/profile', profileRouter);

export default router;