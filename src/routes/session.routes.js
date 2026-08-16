import { Router } from 'express';
import { register, login } from '../controllers/session.controllers.js';
import { userExists } from '../middlewares/session.middlewares.js';

const router = Router();

router.post('/register', register);
router.post('/login', userExists ,login);

export default router;