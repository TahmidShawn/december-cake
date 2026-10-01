const requiredEnv = [
    "NODE_ENV",
    "PORT",
    "MONGODB_URI",
    "DB_NAME",
    "CORS_ORIGIN",
    "CLIENT_URL",
    "JWT_SECRET",
    "JWT_EXPIRE",
    "REFRESH_TOKEN_SECRET",
    "REFRESH_TOKEN_EXPIRE",
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
            `Missing required environment variables: ${missing.join(", ")}`,
        );
    }
};

export default validateEnv;
