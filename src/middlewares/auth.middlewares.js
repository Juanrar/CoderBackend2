import passport from 'passport';
import { createError } from '../utils.js';

export const authenticate = (strategy) => (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) return next(createError(info?.message || 'No autorizado', info?.statusCode || 401));
        req.user = user;
        next();
    })(req, res, next);
};