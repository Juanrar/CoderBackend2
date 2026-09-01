export class TicketDTO {
    constructor(ticket) {
        this.id = ticket._id
        this.reservationCode = ticket.reservationCode
        this.status = ticket.status
        this.quantity = ticket.quantity
        this.event = ticket.event
        this.user = ticket.user
        this.createdAt = ticket.createdAt
    }
}