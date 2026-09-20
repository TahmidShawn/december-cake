import { Router } from "express";
import {
    createAddOn,
    getAddOns,
    getAddOn,
    updateAddOn,
    deleteAddOn,
} from "../controllers/addOn.controller.js";
import {
    isAuthenticatedUser,
    authorizeRoles,
} from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import {
    createAddOnSchema,
    updateAddOnSchema,
} from "../validations/addOn.validation.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router
    .route("/add-ons")
    .get(getAddOns)
    .post(
        isAuthenticatedUser,
        authorizeRoles("admin"),
        upload.single("image"),
        validateRequest(createAddOnSchema),
        createAddOn,
    );

router
    .route("/add-ons/:id")
    .get(getAddOn)
    .put(
        isAuthenticatedUser,
        authorizeRoles("admin"),
        upload.single("image"),
        validateRequest(updateAddOnSchema),
        updateAddOn,
    )
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteAddOn);

export default router;
