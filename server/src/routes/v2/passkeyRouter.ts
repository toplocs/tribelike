import { Router } from 'express';
import multer from 'multer';
import PasskeyController from '../../controllers/passkeyController';

const router = Router();
const upload = multer();

router.post('/auth/passkey/registerStart', 
    upload.none(), 
    PasskeyController.handleRegisterStart
);
router.post('/auth/passkey/registerFinish', 
    upload.none(), 
    PasskeyController.handleRegisterFinish
);
router.post('/auth/passkey/loginStart', 
    upload.none(), 
    PasskeyController.handleLoginStart
);
router.post('/auth/passkey/loginFinish', 
    upload.none(), 
    PasskeyController.handleLoginFinish
);

export default router;