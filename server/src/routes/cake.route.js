import { Router } from "express";
import {
    createCake,
    getCakes,
    getCake,
    updateCake,
    deleteCake,
} from "../controllers/cake.controller.js";
import {
    isAuthenticatedUser,
    authorizeRoles,
} from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import {
    createCakeSchema,
    updateCakeSchema,
} from "../validations/cake.validation.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/cakes").get(getCakes);
router.route("/cakes/:id").get(getCake);

router
    .route("/cakes")
    .post(
        authLimiter,
        isAuthenticatedUser,
        authorizeRoles("admin"),
        upload.array("images"),
        validateRequest(createCakeSchema),
        createCake,
    );

router
    .route("/cakes/:id")
    .put(
        authLimiter,
        isAuthenticatedUser,
        authorizeRoles("admin"),
        upload.array("images"),
        validateRequest(updateCakeSchema),
        updateCake,
    )
    .delete(
        authLimiter,
        isAuthenticatedUser,
        authorizeRoles("admin"),
        deleteCake,
    );

export default router;
