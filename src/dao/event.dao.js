import EventModel from "../models/event.model.js"

export class EventDAO {

    async getById(id) {
        return await EventModel.findById(id).lean();
    }

    async create(data) {
        return await EventModel.create(data);
    }

    async update(id, data) {
        return await EventModel.findByIdAndUpdate(id, data, { new: true }).lean();
    }

    async delete(id) {
        return await EventModel.findByIdAndDelete(id).populate('organizer', 'first_name last_name');
    }

    async paginate(filter, options){
        return await EventModel.paginate(filter, options);
    }

    

}