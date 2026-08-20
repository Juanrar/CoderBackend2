import { Schema, model } from 'mongoose'

const userSchema = new Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^@]+@[^@]+\.[^@]+$/,
            "el formato del correo electrónico no es válido"
        ]
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['user', 'admin', 'organizer'],
        default: 'user'
    }
})

export default model('User', userSchema)