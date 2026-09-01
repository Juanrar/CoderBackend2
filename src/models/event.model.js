import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


const eventSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'El precio no puede ser negativo']
    },
    capacity: {
        type: Number,
        required: true,
        min: [1, 'La capacidad debe ser mayor a 0']
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
        required: true,
        trim: true
    }
})

eventSchema.plugin(mongoosePaginate);

export default model('Event', eventSchema);