import { Router } from 'express';
import { register, login, logout, getCurrentUser, } from '../controllers/session.controllers.js';
import { userExists, authMiddleware } from '../middlewares/session.middlewares.js';
import passport from 'passport';

const router = Router();

router.post('/register', passport.authenticate('register', { session: false }), register);
router.post('/login', passport.authenticate('login', {session: false }) ,login);
router.post('/logout', passport.authenticate('current', { session: false}), logout);
router.get('/current', passport.authenticate('current', { session: false}), getCurrentUser);

export default router;