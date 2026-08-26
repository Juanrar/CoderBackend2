import eventModel from "../models/event.model.js"

export class EventDao {

    async getById(id) {
        return await eventModel.findById(id).lean();
    }

    async create(data) {
        return await EventModel.create(data);
    }

    async update(id, data) {
        return await EventModel.findByIdAndUpdate(id, data, { new: true }).lean();
    }

    async delete(id) {
        return await EventModel.findByIdAndDelete(id);
    }

}