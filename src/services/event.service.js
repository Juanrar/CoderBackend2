import { EventRepository } from '../repository/event.repository.js';
import { UserRepository } from '../repository/user.repository.js'

const eventRepository = new EventRepository();
const userRepository = new UserRepository();

export async function createEventService(eventData, organizerId) {
    const { title, date, location, price, capacity, status, category } = eventData;

    const now = new Date();

    if (new Date(date) <= now) throw new Error("La fecha del evento debe ser mayor a la fecha actual.");
    if (price < 0) throw new Error("El precio debe ser mayor a 0.");
    if (capacity <= 0) throw new Error("La capacidad debe ser mayor a 0.");
    if (status == 'cancelled' || status == 'finished') throw new Error("El estado del evento no es valido.");

    const event = await eventRepository.createEvent({
        title: title,
        date: date,
        location: location,
        price: price,
        capacity: capacity,
        status: status,
        organizer: organizerId,
        category: category
    })

    return event
}

export async function getEventService(query = {}) {
    const { category, status, location, dateFrom, dateTo, limit = 10, page = 1, sort } = query;

    let filter = {}
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (location) filter.location = location;

    if (dateFrom || dateTo) {
        filter.date = {};
        if (dateFrom) filter.date.$gte = new Date(dateFrom);
        if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { date: sort === 'desc' ? -1 : 1 },
        populate: { path: 'organizer', select: 'first_name last_name' },
        lean: true
    };

    const result = await eventRepository.eventPaginate(filter, options);

    return {
        events: result.docs,
        page: result.page,
        limit: result.limit,
        total: result.totalDocs,
        totalPages: result.totalPages
    };
}

export async function getEventByIdService(eventId) {
    const event = await eventRepository.getEventById(eventId);
    if (event == null) throw new Error("Evento no encontrado");
    return event
}

export async function updateEventByIdService(eventId, updateData) {
    const current = await eventRepository.getEventById(eventId);
    if (current == null) throw new Error("Evento no encontrado");
    if (current.status === 'cancelled') throw new Error("No se puede modificar un evento cancelado");

    const { title, description, date, location, price, capacity, category } = updateData;
    const allowed = { title, description, date, location, price, capacity, category };

    Object.keys(allowed).forEach(k => allowed[k] === undefined && delete allowed[k]);

    if (allowed.date && new Date(allowed.date) <= new Date()) throw new Error("La fecha del evento debe ser mayor a la fecha actual.");
    if (allowed.price !== undefined && allowed.price < 0) throw new Error("El precio no puede ser negativo.");
    if (allowed.capacity !== undefined && allowed.capacity <= 0) throw new Error("La capacidad debe ser mayor a 0.");

    const event = await eventRepository.updateEvent(eventId, allowed);
    return event
}


export async function deleteEventByIdService(eventId) {
    const event = await eventRepository.deleteEvent(eventId);
    if (event == null) throw new Error("Evento no encontrado");
    return event
}

export async function updateStatusEventService(eventId, status) {
    const validStatuses = ['draft', 'published', 'cancelled', 'finished'];
    if (!validStatuses.includes(status)) throw new Error("El estado del evento no es válido");

    const current = await eventRepository.getEventById(eventId);
    if (current == null) throw new Error("Evento no encontrado");
    if (current.status === 'cancelled') throw new Error("No se puede modificar un evento cancelado");

    const event = await eventRepository.updateEvent(eventId, { status });
    return event
}
