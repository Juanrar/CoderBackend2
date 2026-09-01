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
        return ticketDAO.getByUserId(userId);
    }

    async getTicketsByEvent(eventId){
        return ticketDAO.getTicketsByEventId(eventId);
    }

    async getTicketById(id) {
        return ticketDAO.getById(id);
    }

    async updateTicket(id, data) {
        return ticketDAO.update(id, data);
    }
}
