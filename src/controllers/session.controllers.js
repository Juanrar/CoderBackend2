import { env } from '../config/env.js';
import jwt from 'jsonwebtoken';
import { UserDTO } from '../dto/index.js';


export async function register(req, res, next) {
    res.status(201).json({ message: 'Usuario registrado exitosamente', user: new UserDTO(req.user) });
}

export async function login(req, res, next) {
    try {
        const { user } = req;
        const sessionData = {
            id: user._id,
            email: user.email,
            role: user.role
        }

        const token = jwt.sign(sessionData, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: env.JWT_COOKIE_EXPIRES_IN * 1000
        })
        res.status(200).json({ message: 'Inicio de sesión exitoso', token: new UserDTO(req.user) });
    } catch (error) {
        next(error);
    }
}

export async function logout(req, res, next) {
    res.clearCookie('authToken',{
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
    res.status(200).json({ message: 'Cierre de sesión exitoso' });
}

export async function getCurrentUser(req, res, next) {
    res.status(200).json({ message: 'Usuario autenticado', user: new UserDTO(req.user) });
}