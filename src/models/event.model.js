import { Schema, model } from 'mongoose';

const eventSchema = new Schema({
    name: String,
    date: Date,
    place: String,
    price: Number,
    capacity: Number,
    status: {
        type: String,
        enum: ['draft', 'published', 'cancelled', 'finished'],
        default: 'draft'
    },
    organizer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true 
    }
})

export default model('Event', eventSchema);