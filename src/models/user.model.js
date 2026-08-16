import { Schema, model } from 'mongoose'

const userSchema = new Schema({
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
        enum: ['user', 'admin'],
        default: 'user'
    }
})

export default model('User', userSchema)