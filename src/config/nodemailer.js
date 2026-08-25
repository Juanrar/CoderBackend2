import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export const transporter = nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: Number(env.MAIL_PORT),
    auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS
    }
})