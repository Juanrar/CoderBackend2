import { EventRepository } from '../repository/event.repository.js';

const eventRepository = new EventRepository();

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user){
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
        }

        next();
    }
}

export const authorizeEventOwnerOrAdmin = async (req, res, next) => {
    const event = await eventRepository.getEventById(req.params.eid)
    
    if (!event) {
        return res.status(404).json({ message: 'Evento no encontrado' });
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = event.owner.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
        return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
    }

    req.event = event;
    next();
}