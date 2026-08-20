import EventModel from '../models/event.model.js';

export async function getAllEvents(req, res, next) {

}

export async function createEvent(req, res, next) {
    try{
        const { name, date, plance, price, capacity } = req.body;

        const newEvent = new EventModel({
            name,
            date,
            plance,
            price,
            capacity,
            status: true
        });
        res.status(201).json({ message: 'Evento creado exitosamente', event: newEvent });
    }catch(error){
        res.status(500).json({ message: 'Error al crear el evento', error: error.message });
    }
}