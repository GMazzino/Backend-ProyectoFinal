import { Router } from 'express';
import upload from '../midwares/file_uploader.js';

import { newUserRegistration, userLogin } from '../handlers/routers/auth.js';

const router = Router();

router.post('/login', userLogin);

router.post('/registro', upload.single('avatar'), newUserRegistration);

export default router;
