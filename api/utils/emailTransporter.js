import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const emailTransporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.SECURE,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});

export default emailTransporter;