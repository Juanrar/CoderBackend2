import { Router } from 'express';
import { getAllEvents, createEvent } from '../controllers/event.controllers.js';
import { authorizeRoles } from '../middlewares/event.middlewares.js';
import passport from 'passport';

const router = Router();

router.get('/', getAllEvents);
router.post('/', passport.authenticate('current', { session: false }), authorizeRoles("admin", "organizer"), createEvent);


export default router;