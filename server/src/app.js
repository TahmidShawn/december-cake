import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import ErrorHandler from "./utils/errorHandler.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import logger from "./utils/logger.js";

// import routes
// import userRouter from "./routes/user.route.js";

// env check
const requiredEnv = ["MONGODB_URI", "DB_NAME", "CORS_ORIGIN"];
requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required env variable: ${key}`);
    }
});

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(pinoHttp({ logger }));

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

// global rate limit
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 100,
        standardHeaders: true,
        legacyHeaders: false,
        message: "Too many requests, please try again later.",
    }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// health check
app.get("/healthz", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// app.use("/api/v1", userRouter);

app.use((req, res, next) => {
    next(new ErrorHandler(`Cannot ${req.method} ${req.originalUrl}`, 404));
});

app.use(errorMiddleware);

export default app;
