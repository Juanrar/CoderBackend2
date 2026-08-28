import ticketModel from '../models/ticket.model.js'
import TicketModel from '../models/ticket.model.js'

export class TicketDAO {
    async findActiveByUserAndEvent(userId, eventId) {
        return TicketModel.findOne({
            user: userId,
            event: eventId,
            status: 'active'
        })
    }

    async getReservedQuantityByEvent(eventId) {
        const result = await TicketModel.aggregate([
            {
                $match: {
                    event: eventId,
                    status: 'active'
                }
            },
            {
                $group: {
                    _id: '$event',
                    totalReserved: {
                        $sum: '$quantity'
                    }
                }
            }
        ])

        return result[0]?.totalReserved || 0
    }

    async create(data) {
        return await TicketModel.create(data)
    }

    async getByUserId(userId){
        return await TicketModel.find({
                user: userId,
            }).populate('event');
    }

    async getTicketsByEventId(eventId){
        return await TicketModel.find({event: eventId}).populate('user', 'first_name last_name email');
    }

    async getById(id){
        return await TicketModel.findById(id);
    }

    async update(id, data){
        return await TicketModel.findByIdAndUpdate(id, data, { new: true });
    }
}
