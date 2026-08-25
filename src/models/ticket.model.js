import { Schema, Types, model } from 'mongoose';

const ticketSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
    },
    event: {
        type: Types.ObjectId,
        ref: 'Event',
    },
    status: {
        type: String,
        enum: ['active', 'used', 'cancelled'],
        default: 'active'
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
    code: String,
    cearteAt: Date
})

export default model('Ticket', ticketSchema);