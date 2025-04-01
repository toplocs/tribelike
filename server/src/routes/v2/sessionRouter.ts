import { Router } from 'express';
import multer from 'multer';
import { handleGetSession } from '../../controllers/session';

const router = Router();
const upload = multer();

router.get('/session', handleGetSession);

export default router;