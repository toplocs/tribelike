import { Router, Handler } from 'express';
import { UserController } from '../../controllers/UserController';

const userRouter = Router();
const usersRouter = Router();
const router = Router();

router.use('/users', usersRouter);
router.use('/user', userRouter);

export default router;

// TODO: authenticated middleware
usersRouter.get('/', UserController.getUsers);
userRouter.put('/:id', UserController.updateUser);
userRouter.get('/:id', UserController.getUserById);
userRouter.delete('/:id', UserController.deleteUser);

// userRouter.get('/:id/activities', UserController.getActivitiesByUserId);
// userRouter.get('/:id/discussions', UserController.getDiscussionsByUserId);
// userRouter.get('/:id/profiles', UserController.getProfilesByUserId);
