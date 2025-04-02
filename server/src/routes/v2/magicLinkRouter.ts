import { Router } from 'express';
import multer from 'multer';
<<<<<<< HEAD
import { resendMagicLink } from '../../controllers/registration';
import { handleMagicLinkLogin } from '../../controllers/authentication';
=======
import MagicLinkController from '../../controllers/auth/magicLinkController';
>>>>>>> 0f74f05daf917f8b935ff614e1352d500237d7b2

const router = Router();
const upload = multer();

<<<<<<< HEAD
router.get('/auth/magicLink/:token', handleMagicLinkLogin);
router.post('/auth/magicLink', resendMagicLink);
=======
router.get('/auth/magicLink/:token', MagicLinkController.handleMagicLinkLogin);
router.post('/auth/magicLink', MagicLinkController.resendMagicLink);
>>>>>>> 0f74f05daf917f8b935ff614e1352d500237d7b2

export default router;