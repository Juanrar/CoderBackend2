import { createTicketService } from '../services/ticket.service.js'


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

export async function updateTicketById(req, res, next) {
    try {

    } catch (error) {

    }
}

export async function cancelTicketById(req, res, next) {
    try {

    } catch (error) {

    }
}

export async function useTicketById(req, res, next) {
    try {

    } catch (error) {

    }
}