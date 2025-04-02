import { Router } from 'express';
import multer from 'multer';
import UserController from '../../controllers/userController';
import { authenticate } from '../../middleware/authenticate';
<<<<<<< HEAD
import { handleAccountCreate } from '../../controllers/registration';
=======
// TODO: put that in UserController
import MagicLinkController from '../../controllers/auth/magicLinkController';
>>>>>>> 0f74f05daf917f8b935ff614e1352d500237d7b2

const router = Router();
const upload = multer();

router.get('/users', authenticate, UserController.GetUsers);
router.get('/user', authenticate, UserController.GetUser);
<<<<<<< HEAD
router.post('/user', upload.none(), handleAccountCreate); //put that in UserController
=======
router.post('/user', upload.none(), MagicLinkController.handleAccountCreate);
>>>>>>> 0f74f05daf917f8b935ff614e1352d500237d7b2
router.put('/user', authenticate, UserController.UpdateUser);
router.delete('/user', authenticate, UserController.DeleteUser);

// TODO: Implement routes for user activities, discussions, and profiles
// router.get('/user/:id/activities', UserController.getActivitiesByUserId);
// router.get('/user/:id/discussions', UserController.getDiscussionsByUserId);
// router.get('/user/:id/profiles', UserController.getProfilesByUserId);

export default router;
