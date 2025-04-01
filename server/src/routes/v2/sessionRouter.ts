import { Router } from 'express';
import multer from 'multer';
import { handleGetSession } from '../../controllers/session';
import { handleLogout } from '../../controllers/authentication';

const router = Router();
const upload = multer();

router.get('/session', handleGetSession);
router.post('/session/logout', handleLogout);
export default router;