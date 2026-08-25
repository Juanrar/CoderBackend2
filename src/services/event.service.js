import userModel from '../models/user.model.js';
import eventModel from '../models/event.model.js';

export async function createEventService(req) {
    const { name, date, place, price, capacity, status, category } = req.body;

    const now = new Date();

    if (date <= now) throw new Error("La fecha del evento debe ser mayor a la fecha actual.");
    if (price < 0) throw new Error("El precio debe ser mayor a 0.");
    if (capacity <= 0) throw new Error("La capacidad debe ser mayor a 0.");
    if (status == 'cancelled' || status == 'finished') throw new Error("El estado del evento no es valido.");


    const { _id } = await userModel.findOne({ email: req.user.email });

    const event = await eventModel.create({
        name: name,
        date: date,
        place: place,
        price: price,
        capacity: capacity,
        status: status,
        organizer: _id,
        category: category
    })

    return event
}

export async function getEventService(query = {}) {
    const { category, status, location, limit = 10, page = 1, sort } = query;

    let filter = {}
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (location) filter.place = location;

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort ? { date: sort === 'asc' ? 1 : -1 } : { date: 1 },
        populate: { path: 'organizer', select: 'first_name last_name' }
    }

    const events = await eventModel.paginate(filter, options);
    return events
}

export async function getEventByIdService(eventId) {
    const event = await eventModel.findById(eventId).populate('organizer', 'first_name last_name');
    if (event == null) throw new Error("Evento no encontrado");
    return event
}

export async function updateEventByIdService(eventId, updateData) {
    const event = await eventModel.findByIdAndUpdate(eventId, updateData);
    if (event == null) throw new Error("Evento no encontrado");
    return event
}

export async function deleteEventByIdService(eventId) {
    const event = await eventModel.findByIdAndDelete(eventId).populate('organizer', 'first_name last_name');

    if (event == null) throw new Error("Evento no encontrado");
    return event
}

export async function updateStatusEventService(eventId, status) {
    const event = await eventModel.findByIdAndUpdate(eventId, { status: status });
    if (event == null) throw new Error("Evento no encontrado");
    return event
}
