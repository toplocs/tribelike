import { Router } from 'express';
import multer from 'multer';
import ProfileController from '../../controllers/ProfileController';
import { authenticate } from '../../middleware/authenticate';

const upload = multer();
const router = Router();
router.use(authenticate);

router.get('/user/profiles', authenticate, ProfileController.GetAllProfilesForUser);

router.get('/profiles', ProfileController.GetAllProfiles);
router.post('/profiles', authenticate, upload.none(), ProfileController.CreateProfile)

router.get('/profile/:id', ProfileController.GetProfileById);
router.put('/profile/:id', upload.none(), ProfileController.UpdateProfile);
router.delete('/profile/:id', ProfileController.DeleteProfile);

export default router;

