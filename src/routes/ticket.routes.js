import { Router } from 'express';
import { getTicketById, cancelTicketById, getMyTickets } from '../controllers/ticket.controllers.js';
import passport from 'passport';

const router = Router();

router.get('/my-tickets', passport.authenticate('current', { session: false }), getMyTickets);
router.get('/:tid', passport.authenticate('current', { session: false }), getTicketById);
router.patch('/:tid/cancel', passport.authenticate('current', { session: false }), cancelTicketById);

export default router;