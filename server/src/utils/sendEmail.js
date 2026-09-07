import nodemailer from "nodemailer";
import logger from "./logger.js";

let transporter;

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
            connectionTimeout: 10000,
            socketTimeout: 10000,
        });
    }
    return transporter;
};

const sendEmail = async (options) => {
    const mailOptions = {
        from: `"Cake Shop" <${process.env.SMTP_MAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    try {
        await getTransporter().sendMail(mailOptions);
    } catch (error) {
        logger.error({ err: error, to: options.email }, "Failed to send email");
        throw error;
    }
};

export default sendEmail;
