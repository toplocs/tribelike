import { Router } from 'express';
import { handleRegisterStart, handleRegisterFinish } from '../../controllers/registration';
import { handleLoginStart, handleLoginFinish, handleLogout } from '../../controllers/authentication';

const registerRoutes = Router();
const loginRoutes = Router();
const router = Router();

router.use('/passkey', registerRoutes);
router.use('/passkey', loginRoutes);

router.post('/passkey/logout', handleLogout);
registerRoutes.post('/registerStart', handleRegisterStart);
registerRoutes.post('/registerFinish', handleRegisterFinish);
loginRoutes.post('/loginStart', handleLoginStart);
loginRoutes.post('/loginFinish', handleLoginFinish);

export default router;