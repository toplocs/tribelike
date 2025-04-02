import { Router } from 'express';
<<<<<<< HEAD
import multer from 'multer';
import { handleGetSession } from '../../controllers/session';

const router = Router();
const upload = multer();

router.get('/session', handleGetSession);

=======
import { handleGetSession, handleLogout } from '../../controllers/auth/session';

const router = Router();

router.get('/auth/session', handleGetSession);
router.post('/auth/logout', handleLogout);

// deprecated
router.get('/session', handleGetSession);
router.post('/logout', handleLogout);
>>>>>>> 0f74f05daf917f8b935ff614e1352d500237d7b2
export default router;