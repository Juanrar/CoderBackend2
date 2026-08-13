import { Schema, model } from 'mongoose';

const eventSchema = new Schema({
    name: String,
    date: Date,
    plance: String,
    price: Number,
    capacity: Number,
    status: Boolean
})

export default model('Event', eventSchema);