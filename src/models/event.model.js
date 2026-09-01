import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: String,
    price: Number,
    capacity: {
        type:Number,
        required: true
    },
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

eventSchema.plugin(mongoosePaginate);

export default model('Event', eventSchema);