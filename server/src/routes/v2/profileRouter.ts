import { Router } from 'express';
import multer from 'multer';
import ProfileController from '../../controllers/profileController';
import { authenticate } from '../../middleware/authenticate';

const upload = multer();
const router = Router();

router.get('/user/profiles', authenticate, ProfileController.GetAllProfilesForUser);

router.get('/profiles', ProfileController.GetAllProfiles);
router.post('/profiles', authenticate, upload.none(), ProfileController.CreateProfile)

router.get('/profile/:id', authenticate, ProfileController.GetProfileById);
router.put('/profile/:id', authenticate, upload.none(), ProfileController.UpdateProfile);
router.delete('/profile/:id', authenticate, ProfileController.DeleteProfile);

export default router;

