import { Router } from "express";
import {
    addCartItem,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart,
} from "../controllers/cart.controller.js";
import { isAuthenticatedUser } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import {
    addCartItemSchema,
    updateCartItemSchema,
} from "../validations/cart.validation.js";

const router = Router();

router
    .route("/cart")
    .get(isAuthenticatedUser, getCart)
    .delete(isAuthenticatedUser, clearCart);

router
    .route("/cart/items")
    .post(isAuthenticatedUser, validateRequest(addCartItemSchema), addCartItem);

router
    .route("/cart/items/:cakeId")
    .patch(
        isAuthenticatedUser,
        validateRequest(updateCartItemSchema),
        updateCartItem,
    )
    .delete(isAuthenticatedUser, removeCartItem);

export default router;
