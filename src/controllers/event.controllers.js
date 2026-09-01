import { createEventService, getEventByIdService, getEventService, updateEventByIdService, deleteEventByIdService, updateStatusEventService } from '../services/event.service.js'
import { EventDTO } from '../dto/index.js'

export async function createEvent(req, res, next) {
    try {
        const event = await createEventService(req.body, req.user._id);
        res.status(201).json({ message: 'Evento creado exitosamente', event: new EventDTO(event) });
    } catch (error) {
        next(error);
    }
}

export async function getEvents(req, res, next) {
    try {
        const { events, page, limit, total, totalPages } = await getEventService(req.query);

        res.status(200).json({
            status: 'success',
            data: events.map(event => new EventDTO(event)),
            page,
            limit,
            total,
            totalPages
        });
    } catch (error) {
        next(error);
    }
}

export async function getEventById(req, res, next) {
    try {
        const event = await getEventByIdService(req.params.eid)
        res.status(200).json({ message: 'Evento obtenido exitosamente', data: new EventDTO(event) })
    } catch (error) {
    next(error);    
}
}

export async function updateEventById(req, res, next) {
    try {
        const event = await updateEventByIdService(req.params.eid, req.body)
        res.status(200).json({ message: 'Evento actualizado exitosamente', data: new EventDTO(event) })
    } catch (error) {
        next(error);    
    }
}

export async function deleteEventById(req, res, next) {
    try {
        const event = await deleteEventByIdService(req.params.eid)
        res.status(200).json({ message: 'Evento eliminado exitosamente', data: new EventDTO(event) })
    } catch (error) {
        next(error);    
    }
}

export async function patchStatusEventById(req, res, next) {
    try {
        const { status } = req.body;
        const event = await updateStatusEventService(req.params.eid, status)
        res.status(200).json({ message: 'Estado del evento actualizado exitosamente', data: new EventDTO(event) })
    } catch (error) {
        next(error);    
    }
}