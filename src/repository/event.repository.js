import { EventDao } from '../dao/event.dao.js'

const eventDAO = new EventDao()

export class EventRepository {
    async getEventById(id) {
        return eventDAO.getById(id)
    }

    async createEvent(data) {
        return eventDAO.create(data)
    }

    async updateEvent(id, data) {
        return eventDAO.update(id, data)
    }

    async deleteEvent(id) {
        return eventDAO.delete(id)
    }
}
