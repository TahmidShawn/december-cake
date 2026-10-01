import { Router } from "express";
import { getMe, updatePassword } from "../controllers/user.controller.js";
import { isAuthenticatedUser } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { updatePasswordSchema } from "../validations/user.validation.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

// Get current user
router.route("/auth/me").get(isAuthenticatedUser, getMe);

// Update password
router
    .route("/password/update")
    .put(
        authLimiter,
        isAuthenticatedUser,
        validateRequest(updatePasswordSchema),
        updatePassword,
    );

export default router;
