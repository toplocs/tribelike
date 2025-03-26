import { Router } from 'express';
import multer from 'multer';

const router = Router();
const upload = multer();

router.get('/auth/magicLink/:id', handleMagicLinkLogin);

export default router;