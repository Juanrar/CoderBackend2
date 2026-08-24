import { Router } from 'express';
import { getEvents, createEvent, getEventById, updateEventById, deleteEventById, patchStatusEventById } from '../controllers/event.controllers.js';
import { authorizeRoles } from '../middlewares/event.middlewares.js';
import passport from 'passport';

const router = Router();

router.get('/', getEvents);
router.get('/:eid', getEventById)
router.post('/', passport.authenticate('current', { session: false }), authorizeRoles("admin", "organizer"), createEvent);
router.put('/:eid', passport.authenticate('current', { session: false }), authorizeRoles("admin", "organizer"), updateEventById);
router.patch('/:eid/status', passport.authenticate('current', { session: false }), authorizeRoles("admin", "organizer"), patchStatusEventById);
router.delete('/:eid', passport.authenticate('current', { session: false }), authorizeRoles("admin", "organizer"), deleteEventById);


export default router;