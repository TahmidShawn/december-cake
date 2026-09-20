import { Router } from "express";
import {
    cancelMyOrder,
    createOrder,
    getAllOrders,
    getMyOrder,
    getMyOrders,
    getOrder,
    updateOrderStatus,
} from "../controllers/order.controller.js";
import {
    isAuthenticatedUser,
    authorizeRoles,
} from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { createOrderSchema } from "../validations/order.validation.js";

const router = Router();

router
    .route("/order")
    .post(isAuthenticatedUser, validateRequest(createOrderSchema), createOrder)
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

router.route("/orders").get(isAuthenticatedUser, getMyOrders);

router
    .route("/order/:id")
    .get(isAuthenticatedUser, getMyOrder)
    .patch(isAuthenticatedUser, cancelMyOrder);

router
    .route("/admin/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getOrder);

router
    .route("/admin/:id/status")
    .patch(isAuthenticatedUser, authorizeRoles("admin"), updateOrderStatus);

export default router;
