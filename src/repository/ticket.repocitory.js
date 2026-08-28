import { TicketDAO } from '../dao/ticket.dao.js'

const ticketDAO = new TicketDAO()

export class TicketRepository {
    async getActiveTicketByUserAndEvent(userId, eventId) {
        return ticketDAO.findActiveByUserAndEvent(userId, eventId);
    }

    async getReservedQuantity(eventId) {
        return ticketDAO.getReservedQuantityByEvent(eventId);
    }

    async createTicket(data) {
        return ticketDAO.create(data);
    }

    async getTicketByUser(userId){
        return ticketDAO.getTicketByUserId(userId);
    }
}
