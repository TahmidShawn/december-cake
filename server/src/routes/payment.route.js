import { Router } from "express";
import {
    createPayment,
    paymentCallback,
    myFatoorahWebhook,
} from "../controllers/payment.controller.js";
import { isAuthenticatedUser } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { createPaymentSchema } from "../validations/payment.validation.js";

const router = Router();

router
    .route("/payments")
    .post(
        isAuthenticatedUser,
        validateRequest(createPaymentSchema),
        createPayment,
    );

router.route("/payments/callback").get(paymentCallback);

router.route("/payments/webhook").post(myFatoorahWebhook);

export default router;