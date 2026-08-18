import userModel from '../models/user.model.js';
import { env } from '../config/env.js';
import jwt from 'jsonwebtoken';

export async function userExists(req, res, next) {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if(user == null){
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    req.user = user;
    next()
}

export const authMiddleware = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        let token;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }else if (req.cookies && req.cookies.authToken) {
            token = req.cookies.authToken;
        }

        if(!token){
            return res.status(401).json({ message: 'Token no proporcionado' });
        }

        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        return res.status(401).json({ message: 'Token inválido' });
    }
}