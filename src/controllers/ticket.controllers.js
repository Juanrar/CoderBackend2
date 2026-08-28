import { createTicketService, getMyTicketsService, getTicketsByEventService } from '../services/ticket.service.js'
import { TicketDAO, TicketDTO } from '../dto/index.js'

export async function createTicket(req, res, next) {
    try {
        const ticket = await createTicketService(req);
        res.status(201).json({ message: "Ticket creado exitosamente ", ticket: ticket });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el ticket ", error: error.message });
    }
}

export async function getTicketById(req, res, next) {
    try {

    } catch (error) {

    }
}

export async function getAllTickets(req, res, next){
    try {
        const tickets = await getTicketsByEventService(req);
        const formattedTickets = tickets.map(ticket => TicketDTO(ticket));

        res.status(200).json({ status: 'Tickets obtenidos exitosamente', tickets: formattedTickets});
    } catch (error){
        res.status(500).json({ message: "Error al obtener los tickets", error: error.message });
    }
}

export async function getMyTickets(req, res, next) {
    try {
        const tickets = await getMyTicketsService(req);
        res.status(200).json({ message: 'Tickets obtenidos exitosamente', data: tickets });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los tickets', error: error.message });
    }
}

export async function updateTicketById(req, res, next) {
    try {

    } catch (error) {

    }
}

export async function cancelTicketById(req, res, next) {
    try {
        const tickets = await cancelTicketByIdService(req);
        res.status(200).json({ message: 'Tickets obtenidos exitosamente', data: tickets });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los tickets', error: error.message });
    }
}

export async function useTicketById(req, res, next) {
    try {

    } catch (error) {

    }
}