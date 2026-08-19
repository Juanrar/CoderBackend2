import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
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
            last_name
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

export function initializePassport(){
    passport.use("register", new LocalStrategy( registerConfig, registerCallback));
}