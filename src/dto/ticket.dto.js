export class TicketDTO {
    constructor(ticket) {
        this.id = ticket._id
        this.code = ticket.code
        this.status = ticket.status
        this.quantity = ticket.quantity
        this.event = ticket.event
        this.createdAt = ticket.createdAt
    }
}