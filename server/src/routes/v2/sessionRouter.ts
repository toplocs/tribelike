import { Router } from 'express';
import { handleGetSession, handleLogout } from '../../controllers/auth/session';

const router = Router();

router.get('/auth/session', handleGetSession);
router.post('/auth/logout', handleLogout);

// deprecated
router.get('/session', handleGetSession);
router.post('/logout', handleLogout);
export default router;