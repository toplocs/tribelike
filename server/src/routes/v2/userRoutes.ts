import { Router } from 'express';
import UserController from '../../controllers/UserController';
import { authenticate } from '../../middleware/authenticate';

const router = Router();

router.get('/users', authenticate, UserController.GetUsers);
router.put('/user/:id', authenticate, UserController.UpdateUser);
router.get('/user/:id', authenticate, UserController.GetUserById);
router.delete('/user/:id', authenticate, UserController.DeleteUser);

// TODO: Implement routes for user activities, discussions, and profiles
// router.get('/user/:id/activities', UserController.getActivitiesByUserId);
// router.get('/user/:id/discussions', UserController.getDiscussionsByUserId);
// router.get('/user/:id/profiles', UserController.getProfilesByUserId);

export default router;
