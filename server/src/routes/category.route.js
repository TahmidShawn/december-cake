import { Router } from "express";
import {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
} from "../controllers/category.controller.js";
import { isAuthenticatedUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import {
    createCategorySchema,
    updateCategorySchema,
} from "../validations/category.validation.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/categories").get(getCategories);
router.route("/categories/:id").get(getCategory);

router
    .route("/categories")
    .post(
        authLimiter,
        isAuthenticatedUser,
        authorizeRoles("admin"),
        upload.single("image"),
        validateRequest(createCategorySchema),
        createCategory,
    );

router
    .route("/categories/:id")
    .put(
        authLimiter,
        isAuthenticatedUser,
        authorizeRoles("admin"),
        upload.single("image"),
        validateRequest(updateCategorySchema),
        updateCategory,
    )
    .delete(
        authLimiter,
        isAuthenticatedUser,
        authorizeRoles("admin"),
        deleteCategory,
    );

export default router;
