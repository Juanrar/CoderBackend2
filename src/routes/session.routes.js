import { Router } from 'express';
import { register, login, getCurrentUser } from '../controllers/session.controllers.js';
import { userExists, authMiddleware } from '../middlewares/session.middlewares.js';

const router = Router();

router.post('/register', register);
router.post('/login', userExists ,login);
router.get('/current', authMiddleware, getCurrentUser);

export default router;