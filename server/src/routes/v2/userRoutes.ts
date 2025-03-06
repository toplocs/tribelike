import { Router, Handler } from 'express';
import { UserController } from '../../controllers/UserController';

const userRouter = Router();
const usersRouter = Router();
const router = Router();

router.use('/users', usersRouter);
router.use('/user', userRouter);

export default router;

usersRouter.get('/', UserController.getUsers);
usersRouter.post('/', UserController.createUser);
userRouter.put('/:id', UserController.updateUser);
userRouter.get('/:id', UserController.getUserById);
userRouter.delete('/:id', UserController.deleteUser);

// userRouter.get('/:id/activities', UserController.getActivitiesByUserId);
// userRouter.get('/:id/discussions', UserController.getDiscussionsByUserId);
// userRouter.get('/:id/profiles', UserController.getProfilesByUserId);
