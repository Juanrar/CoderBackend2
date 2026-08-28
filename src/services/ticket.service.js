import ticketModel from '../models/ticket.model.js';
import { generateTicketCode } from '../utils.js';
import { sendTicketConfirmationEmail } from './nodemailer.service.js';
import { EventRepository } from '../repository/event.repository.js';
import { TicketRepository } from '../repository/ticket.repocitory.js';

const eventRepository = new EventRepository();
const ticketRepository = new TicketRepository();

export async function createTicketService(req) {
    const { quantity = 1 } = req.body;
    const eventId = req.params.eid;
    const user = req.user;
    const userId = user._id;

    if (quantity <= 0) throw new Error("La cantidad tiene que ser mayor a uno");

    const event = await eventRepository.getEventById(eventId);

    if (!event) throw new Error("Evento no encontrado");
    if (event.status !== 'published') throw new Error("El evento no esta disponible para inscribirse");
    if (event.date <= new Date()) throw new Error("No es posible inscribirse a un evento finalizado");

    const existingTicket = await ticketRepository.getActiveTicketByUserAndEvent({
        user: userId,
        event: event._id,
        status: 'active'
    });

    if (existingTicket) throw new Error("Ya tenes una inscripcion activa para este evento");

    const result = await ticketRepository.getReservedQuantity(event._id);

    const reserved = result[0]?.totalReserver || 0;
    const available = event.capacity - reserved;

    if (quantity > available) throw new Error("No hay cupos suficientes disponibles");

    const ticketCode = generateTicketCode();

    const ticket = await ticketRepository.createTicket({
        user: userId,
        event: event._id,
        quantity,
        reservationCode: ticketCode,
        status: 'active'
    });

    try {
        await sendTicketConfirmationEmail({
            to: user.email,
            userName: user.first_name || user.email,
            eventTitle: event.title,
            ticketCode: ticket.reservationCode
        });
    } catch (mailError) {
        console.error("Error al enviar email de confirmación:", mailError.message);
    }

    return ticket;
}

export async function getMyTicketsService(req) {
    const userId = req.user._id;
    const tickets = await ticketRepository.getTicketByUser(userId);
    return tickets;

}

export async function updateTicketByIdService() {

}

export async function cancelTicketByIdService() {

}

export async function useTicketByIdService() {

}