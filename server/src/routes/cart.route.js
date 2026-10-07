import { Router } from "express";
import {
    addCartAddOn,
    addCartItem,
    clearCart,
    getCart,
    removeCartAddOn,
    removeCartItem,
    updateCartAddOn,
    updateCartItem,
} from "../controllers/cart.controller.js";
import { isAuthenticatedUser } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import {
    addCartAddOnSchema,
    addCartItemSchema,
    updateCartAddOnSchema,
    updateCartItemSchema,
} from "../validations/cart.validation.js";

const router = Router();

router
    .route("/cart")
    .get(isAuthenticatedUser, getCart)
    .delete(isAuthenticatedUser, clearCart);

router
    .route("/cart/items")
    .post(
        isAuthenticatedUser,
        validateRequest(addCartItemSchema),
        addCartItem,
    );

router
    .route("/cart/items/:cakeId")
    .patch(
        isAuthenticatedUser,
        validateRequest(updateCartItemSchema),
        updateCartItem,
    )
    .delete(isAuthenticatedUser, removeCartItem);

router
    .route("/cart/add-ons")
    .post(
        isAuthenticatedUser,
        validateRequest(addCartAddOnSchema),
        addCartAddOn,
    );

router
    .route("/cart/add-ons/:addOnId")
    .patch(
        isAuthenticatedUser,
        validateRequest(updateCartAddOnSchema),
        updateCartAddOn,
    )
    .delete(isAuthenticatedUser, removeCartAddOn);

export default router;