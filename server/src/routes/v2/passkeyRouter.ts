import { Router } from 'express';
import multer from 'multer';
import { handleRegisterStart, handleRegisterFinish } from '../../controllers/registration';
import { handleLoginStart, handleLoginFinish, handleLogout } from '../../controllers/authentication';

const router = Router();
const upload = multer();

router.post('/auth/passkey/logout', handleLogout);
router.post('/auth/passkey/registerStart', upload.none(), handleRegisterStart);
router.post('/auth/passkey/registerFinish', upload.none(), handleRegisterFinish);
router.post('/auth/passkey/loginStart', upload.none(), handleLoginStart);
router.post('/auth/passkey/loginFinish', upload.none(), handleLoginFinish);

export default router;