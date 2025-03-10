import { Router } from 'express';
import multer from 'multer';
import { handleRegisterStart, handleRegisterFinish } from '../../controllers/registration';
import { handleLoginStart, handleLoginFinish, handleLogout } from '../../controllers/authentication';

const router = Router();
const upload = multer();

router.post('/passkey/logout', handleLogout);
router.post('/passkey/registerStart', upload.none(), handleRegisterStart);
router.post('/passkey/registerFinish', upload.none(), handleRegisterFinish);
router.post('/passkey/loginStart', handleLoginStart);
router.post('/passkey/loginFinish', handleLoginFinish);

export default router;