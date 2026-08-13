import { Schema, Types, model } from 'mongoose';

const ticketSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
    },
    event: {
        type: Types.ObjectId,
        ref: 'Event',
    }
})

export default model('Ticket', ticketSchema);