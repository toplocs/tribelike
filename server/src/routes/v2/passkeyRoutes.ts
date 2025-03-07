import { Router } from 'express';
import { handleRegisterStart, handleRegisterFinish } from '../../controllers/registration';
import { handleLoginStart, handleLoginFinish, handleLogout } from '../../controllers/authentication';

const router = Router();

router.post('/passkey/logout', handleLogout);
router.post('/passkey/registerStart', handleRegisterStart);
router.post('/passkey/registerFinish', handleRegisterFinish);
router.post('/passkey/loginStart', handleLoginStart);
router.post('/passkey/loginFinish', handleLoginFinish);

export default router;