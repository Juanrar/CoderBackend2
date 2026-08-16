import { createHash, isValidPassword } from '../utils.js';
import Users from '../models/user.model.js';
import userModel from '../models/user.model.js';
import { env } from '../config/env.js';
import jwt from 'jsonwebtoken';


export async function register(req, res, next) {
    try{
        const { email, password } = req.body;
        const hashedPassword = await createHash(password);
        const newUser = await userModel.create({
            email,
            password: hashedPassword
        });
        const sessionData = {
            email: newUser.email,
            role: newUser.role
        }
        res.status(201).json({ message: 'Usuario registrado exitosamente', user: sessionData });
    }catch(error){
        if(error.code === 11000){
            res.status(409).json({ message: 'El correo electrónico ya está registrado' });
        }else{
            res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
        }
    }
}

export async function login(req, res, next) {
    try{
        const {user} = req;
        const { password } = req.body;
        if(isValidPassword(password, user.password)){
             const sessionData = {
                email: user.email,
                role: user.role
            }

            const token = jwt.sign(sessionData, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

            res.status(200).json({ message: 'Inicio de sesión exitoso', token: token ,sessionData });
        }else{
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
    }catch(error){
        res.status(401).json({error: error.message });
    }
}