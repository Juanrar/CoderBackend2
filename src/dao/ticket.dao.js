import { TicketModel } from '../models/ticket.model.js'

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
        return TicketModel.create(data)
    }

    async getTicketByUserId(userId){
        await ticketModel.find({
                user: userId,
            }).populate('event');
    }
}
