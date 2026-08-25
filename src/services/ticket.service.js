import ticketModel from '../models/ticket.model.js';
import eventModel from '../models/event.model.js';
import userModel from '../models/user.model.js';
import { generateTicketCode } from '../utils.js';
import { sendTicketConfirmationEmail } from './nodemailer.service.js';

export async function createTicketService(req) {
    const { eventId, quantity = 1 } = req.body;
    const user = req.user;
    const userId = user._id;

    if (quantity <= 0) throw new Error("La cantidad tiene que ser mayor a uno");

    const event = await eventModel.findById(eventId);

    if (!event) throw new Error("Evento no encontrado");
    if (event.status !== 'published') throw new Error("El evento no esta disponible para inscribirse");
    if (event.date <= new Date()) throw new Error("No es posible inscribirse a un evento finalizado");

    const existingTicket = await ticketModel.findOne({
        user: userId,
        event: event._id,
        status: 'active'
    });

    if (existingTicket) throw new Error("Ya tenes una inscripcion activa para este evento");

    const result = await ticketModel.aggregate([
        {
            $match: {
                event: event._id,
                status: "active"
            }
        },
        {
            $group: {
                _id: "$event",
                totalReserver: {
                    $sum: '$quantity'
                }
            }
        }
    ]);

    const reserved = result[0]?.totalReserver || 0;
    const available = event.capacity - reserved;

    if (quantity > available) throw new Error("No hay cupos suficientes disponibles");

    const ticketCode = generateTicketCode();

    const ticket = await ticketModel.create({
        user: userId,
        event: event._id,
        quantity,
        code: ticketCode,
        status: 'active'
    });

    try {
        await sendTicketConfirmationEmail({
            to: user.email,
            userName: user.first_name || user.email,
            eventTitle: event.name,
            ticketCode: ticket.code
        });
    } catch (mailError) {
        console.error("Error al enviar email de confirmación:", mailError.message);
    }

    return ticket;
}

export async function getMyTicketsService(req) {
    const userId = req.user._id;
    const tickets = await ticketModel.find({
        user: userId,
    }).populate('event');

    return tickets;

}

export async function updateTicketByIdService() {

}

export async function cancelTicketByIdService() {

}

export async function useTicketByIdService() {

}