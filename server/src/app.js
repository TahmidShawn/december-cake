import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";

import cookieParser from "cookie-parser";
import ErrorHandler from "./utils/errorHandler.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import logger from "./utils/logger.js";
import validateEnv from "./config/validateEnv.js";
import { globalLimiter } from "./middlewares/rateLimiter.middleware.js";

// import routes
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import categoryRouter from "./routes/category.route.js";

// env check

validateEnv();
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
app.use(globalLimiter);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// health check
app.get("/healthz", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// router

app.use("/api/v1", authRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", categoryRouter);

app.use((req, res, next) => {
    next(new ErrorHandler(`Cannot ${req.method} ${req.originalUrl}`, 404));
});

app.use(errorMiddleware);

export default app;
