import { Router } from 'express';
import multer from 'multer';
import UserController from '../../controllers/userController';
import { authenticate } from '../../middleware/authenticate';
import { handleAccountCreate } from '../../controllers/registration';

const router = Router();
const upload = multer();

router.get('/users', authenticate, UserController.GetUsers);
router.get('/user', authenticate, UserController.GetUser);
router.post('/user', upload.none(), handleAccountCreate); //put that in UserController
router.put('/user', authenticate, UserController.UpdateUser);
router.delete('/user', authenticate, UserController.DeleteUser);

// TODO: Implement routes for user activities, discussions, and profiles
// router.get('/user/:id/activities', UserController.getActivitiesByUserId);
// router.get('/user/:id/discussions', UserController.getDiscussionsByUserId);
// router.get('/user/:id/profiles', UserController.getProfilesByUserId);

export default router;
