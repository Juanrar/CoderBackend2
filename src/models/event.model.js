import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


const eventSchema = new Schema({
    title: String,
    date: Date,
    location: String,
    description: String,
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

eventSchema.plugin(mongoosePaginate);

export default model('Event', eventSchema);