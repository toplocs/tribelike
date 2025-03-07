import { Router, Handler } from 'express';
import { UserController } from '../../controllers/UserController';

const router = Router();

// TODO: authenticated middleware

router.get('/users', UserController.getUsers);
router.put('/user/:id', UserController.updateUser);
router.get('/user/:id', UserController.getUserById);
router.delete('/user/:id', UserController.deleteUser);

// TODO: Implement routes for user activities, discussions, and profiles
// router.get('/user/:id/activities', UserController.getActivitiesByUserId);
// router.get('/user/:id/discussions', UserController.getDiscussionsByUserId);
// router.get('/user/:id/profiles', UserController.getProfilesByUserId);

export default router;
