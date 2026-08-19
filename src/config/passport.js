import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy } from 'passport-jwt';
import { createHash, isValidPassword } from '../utils.js';
import UserModel from '../models/user.model.js';

const registerConfig = {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
    session: false
}

async function registerCallback(req, username, password, done){
    try{
        const { first_name, last_name } = req.body;
        const hashedPassword = await createHash(password);
        const newUser = await UserModel.create({
            email: username,
            password: hashedPassword,
            first_name,
            last_name,
            role: 'user'
        });
        return done(null, newUser);
    }catch(error){
        if(error.code === 11000){
            return done(null, false, { message: 'El correo electrónico ya está registrado'});
        }else{
            return done(error.message, false);
        }
    }
}

const loginConfig = {
    usernameField: "email",
    passwordField: "password",
    session: false
}

async function loginCallback(req, username, password, done){
    try{
        const normalizedUsername = username.toLowerCase().trim();
        const user = await UserModel.findOne({ email: normalizedUsername });
        if(!user){
            return done(null, false, { message: 'Credenciales invalidas' });
        }

        const passwordIsValid = await isValidPassword(password, user.password);
        if(!passwordIsValid){
            return done(null, false, { message: 'Credenciales invalidas' });
        }

        return done(null, user);
    }catch(error){
        return done(error.message, false);
    }
}

const jwtConfig = {
    jwtFromRequest: (req) =>{
        let token = null;
        if(req && req.cookies){
            token = req.cookies.authToken;
        }
        return token;
    },
    secretOrKey: process.env.JWT_SECRET
}

async function jwtCallback(jwt_payload, done){
    try{
        const user = await UserModel.findById(jwt_payload.id).select('-password');
        if(!user){
            return done(null, false, { message: 'Usuario no encontrado' });
        }
        return done(null, user);
    }catch(error){
        done(error.message, false);
    }
}

export function initializePassport(){
    passport.use("register", new LocalStrategy( registerConfig, registerCallback));
    passport.use("login", new LocalStrategy( loginConfig, loginCallback));
    passport.use("current", new JWTStrategy( jwtConfig, jwtCallback));
}