import { isValidPassword } from '../utils.js';
import Users from '../models/user.model.js';
import userModel from '../models/user.model.js';
import { env } from '../config/env.js';
import jwt from 'jsonwebtoken';


export async function register(req, res, next) {
    const sessionData = {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role
    };
    res.status(201).json({ message: 'Usuario registrado exitosamente', user: sessionData });
}

export async function login(req, res, next) {
    try{
        const {user} = req;
        const { password } = req.body;
        if(isValidPassword(password, user.password)){
             const sessionData = {
                id: user._id,
                email: user.email,
                role: user.role
            }

            const token = jwt.sign(sessionData, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: env.JWT_COOKIE_EXPIRES_IN * 1000
            })
            res.status(200).json({ message: 'Inicio de sesión exitoso', token: token ,sessionData });
        }else{
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
    }catch(error){
        res.status(401).json({error: error.message });
    }
}

export async function logout(req, res, next){
    res.clearCookie('authToken');
    res.status(200).json({ message: 'Cierre de sesión exitoso' });
}

export async function getCurrentUser(req, res, next){
    res.status(200).json({ message: 'Usuario autenticado', user: req.user });
}