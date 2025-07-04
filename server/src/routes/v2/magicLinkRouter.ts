import { Router } from 'express';
import multer from 'multer';
import MagicLinkController from '../../controllers/auth/magicLinkController';

const router = Router();
const upload = multer();

router.get('/auth/magicLink/:token', MagicLinkController.handleMagicLinkLogin);
router.post('/auth/magicLink', upload.none(), MagicLinkController.sendMagicLink);
router.post('/auth/magicLink/resend', MagicLinkController.resendMagicLink);

export default router;