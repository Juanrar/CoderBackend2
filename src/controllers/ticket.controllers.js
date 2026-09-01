import {
    createTicketService,
    getMyTicketsService,
    getTicketsByEventService,
    cancelTicketByIdService,
    getTicketByIdService
} from '../services/ticket.service.js'
import { TicketDTO } from '../dto/index.js'

export async function createTicket(req, res, next) {
    try {
        const ticket = await createTicketService(req);
        res.status(201).json({ status: 'success', payload: new TicketDTO(ticket) });
    } catch (error) {
        next(error);
    }
}

export async function getAllTickets(req, res, next) {
    try {
        const tickets = await getTicketsByEventService(req);
        res.status(200).json({
            status: 'success',
            payload: tickets.map(ticket => new TicketDTO(ticket))
        });
    } catch (error) {
        next(error);
    }
}

export async function getMyTickets(req, res, next) {
    try {
        const tickets = await getMyTicketsService(req);
        res.status(200).json({
            status: 'success',
            payload: tickets.map(ticket => new TicketDTO(ticket))
        });
    } catch (error) {
        next(error);
    }
}

export async function cancelTicketById(req, res, next) {
    try {
        const ticket = await cancelTicketByIdService(req);
        res.status(200).json({
            status: 'success',
            message: 'Ticket cancelado exitosamente',
            payload: new TicketDTO(ticket)
        });
    } catch (error) {
        next(error);
    }
}

export async function getTicketById(req, res , next){
    try{
        const ticket = await getTicketByIdService(req);
        res.status(200).json({ status: 'succes', payload: new TicketDTO(ticket)});
    }catch (error){
        next(error);
    }
}