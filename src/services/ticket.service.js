import { generateTicketCode, createError } from '../utils.js';
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

    if (quantity <= 0) throw createError("La cantidad debe ser mayor a 0", 400);

    const event = await eventRepository.getEventById(eventId);

    if (!event) throw createError("Evento no encontrado", 404);
    if (event.status !== 'published') throw createError("El evento no está disponible para inscribirse", 409);
    if (event.date <= new Date()) throw createError("No es posible inscribirse a un evento que ya ocurrió", 409);

    const existingTicket = await ticketRepository.getActiveTicketByUserAndEvent(userId, event._id);
    if (existingTicket) throw createError("Ya tenés una inscripción activa a este evento", 409);

    const reserved = await ticketRepository.getReservedQuantity(event._id);
    const available = event.capacity - reserved;

    if (quantity > available) throw createError("No hay cupos suficientes disponibles", 409);
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

export async function getTicketsByEventService(req) {
    const eventId = req.params.eid;
    const tickets = await ticketRepository.getTicketsByEvent(eventId);
    return tickets;
}

export async function cancelTicketByIdService(req) {
    const ticketId = req.params.tid;
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    const ticket = await ticketRepository.getTicketById(ticketId);

    if (!ticket) throw createError("Ticket no encontrado", 404);
    
    if (ticket.user.toString() !== userId.toString() && !isAdmin) {
        throw createError("No tenés permiso para cancelar este ticket", 403);
    }

    if (ticket.status === 'cancelled') throw createError("El ticket ya se encuentra cancelado", 409);

    const updatedTicket = await ticketRepository.updateTicket(ticketId, {
        status: 'cancelled',
        cancelledAt: new Date()
    });

    return updatedTicket;
}

export async function getTicketByIdService(req) {
    const ticketId = req.params.tid;
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    const ticket = await ticketRepository.getTicketById(ticketId);

    if (!ticket) throw createError("Ticket no encontrado", 404);

    if (ticket.user.toString() !== userId.toString() && !isAdmin) {
        throw createError("No tenés permiso para ver este ticket", 403);
    }

    return ticket;
}