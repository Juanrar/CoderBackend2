import { Router } from 'express';
import { createTicket, getTicketById, updateTicketById, cancelTicketById, useTicketById, getMyTickets } from '../controllers/ticket.controllers.js';
import passport from 'passport';

const router = Router();

router.post('/', passport.authenticate('current', { session: false }), createTicket);
router.get('/my-tickets', passport.authenticate('current', { session: false }), getMyTickets);
router.get('/:tid', passport.authenticate('current', { session: false }), getTicketById);
router.patch('/:tid', passport.authenticate('current', { session: false }), updateTicketById);
router.patch('/:tid/cancel', passport.authenticate('current', { session: false }), cancelTicketById);
router.patch('/:tid/use', passport.authenticate('current', { session: false }), useTicketById);

export default router;