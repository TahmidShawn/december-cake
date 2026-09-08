import rateLimit from "express-rate-limit";

// applied to the whole app
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 200, // 200 requests per ip per window
    message: {
        success: false,
        message: "Too many requests from this IP. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: {
        success: false,
        message: "Too many attempts. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
