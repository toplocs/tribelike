import { Router } from 'express';
import v2interestRouter from '../../api/v2/interest';
import v2locationRouter from '../../api/v2/location';
import v2profileRouter from '../../api/v2/profile';
import userRouter from './userRoutes';
import passkeyRoutes from '../v2/passkeyRoutes';

const router = Router();
router.use('/', passkeyRoutes, userRouter);

router.use('/interest', v2interestRouter);
router.use('/location', v2locationRouter);
router.use('/profile', v2profileRouter);

export default router;
