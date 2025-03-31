import { Router } from 'express';
import multer from 'multer';
import { resendMagicLink } from '../../controllers/registration';
import { handleMagicLinkLogin } from '../../controllers/authentication';

const router = Router();
const upload = multer();

router.get('/auth/magicLink/:id', handleMagicLinkLogin);
router.post('/auth/magicLink', resendMagicLink);

export default router;