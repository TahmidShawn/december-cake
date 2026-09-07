const requiredEnv = [
    "MONGODB_URI",
    "DB_NAME",
    "CORS_ORIGIN",
    "JWT_SECRET",
    "JWT_EXPIRE",
    "COOKIE_EXPIRE",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_MAIL",
    "SMTP_PASSWORD",
];

const validateEnv = () => {
    const missing = requiredEnv.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(
            `Missing required env variables: ${missing.join(", ")}`,
        );
    }
};

export default validateEnv;
