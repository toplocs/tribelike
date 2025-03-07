import { Router } from 'express';
import activityRouter from '../../api/activity';
import authRouter from '../../api/auth';
import discussionRouter from '../../api/discussion';
import interestRouter from '../../api/interest';
import locationRouter from '../../api/location';
import pluginRouter from '../../api/plugin';
import profileRouter from '../../api/profile';
import relationRouter from '../../api/relation';
import userRouter from '../../api/user';

const router = Router();
router.use('/activity', activityRouter);
router.use('/auth', authRouter);
router.use('/discussion', discussionRouter);
router.use('/interest', interestRouter);
router.use('/location', locationRouter);
router.use('/plugin', pluginRouter);
router.use('/profile', profileRouter);
router.use('/relation', relationRouter);
router.use('/user', userRouter);

export default router;