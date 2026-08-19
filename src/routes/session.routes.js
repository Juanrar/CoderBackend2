import { Router } from 'express';
import { register, login, logout, getCurrentUser, } from '../controllers/session.controllers.js';
import { userExists, authMiddleware } from '../middlewares/session.middlewares.js';
import passport from 'passport';

const router = Router();

router.post('/register', passport.authenticate('register', { session: false }), register);
router.post('/login', userExists ,login);
router.post('/logout', authMiddleware, logout);
router.get('/current', authMiddleware, getCurrentUser);

export default router;