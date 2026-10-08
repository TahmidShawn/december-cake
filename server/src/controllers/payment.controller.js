import Payment from "../models/payment.model.js";
import Order from "../models/order.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import asyncHandler from "../utils/asyncHandler.js";
import logger from "../utils/logger.js";
import { paymentCallbackSchema } from "../validations/payment.validation.js";
import {
    createMyFatoorahPayment,
    getMyFatoorahPayment,
} from "../services/myfatoorah.service.js";
import {
    markPaymentAsPaid,
    releaseStockForExpiredPayment,
} from "../services/payment.service.js";
import { verifyMyFatoorahSignature } from "../utils/myfatoorahSignature.js";

export const createPayment = asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    const order = await Order.findOne({
        _id: orderId,
        user: req.user._id,
        paymentMethod: "online",
    });

    if (!order) {
        throw new ErrorHandler("Online order not found", 404);
    }

    if (order.paymentStatus !== "pending") {
        throw new ErrorHandler("This order is no longer awaiting payment", 400);
    }

    if (order.orderStatus !== "pending") {
        throw new ErrorHandler("This order can no longer be paid", 400);
    }

    let payment = await Payment.findOne({
        order: order._id,
    });

    if (payment?.status === "paid") {
        throw new ErrorHandler("This order has already been paid", 400);
    }

    if (payment?.status === "expired") {
        throw new ErrorHandler("This order's payment period has expired", 400);
    }

    if (payment?.status === "pending" && payment.paymentUrl) {
        return res.status(200).json({
            success: true,
            message: "Payment already created",
            data: {
                invoiceId: payment.invoiceId,
                paymentUrl: payment.paymentUrl,
            },
        });
    }

    if (!payment) {
        payment = await Payment.create({
            order: order._id,
            user: req.user._id,
            provider: "myfatoorah",
            amount: order.totalPrice,
            currency: "KWD",
            status: "pending",
        });
    }

    if (payment.amount !== order.totalPrice) {
        throw new ErrorHandler(
            "Payment amount does not match order amount",
            409,
        );
    }

    try {
        const result = await createMyFatoorahPayment({
            amount: payment.amount,
            orderId: order._id.toString(),
            customer: {
                name: order.shippingAddress.fullName,
                email: req.user.email,
            },
        });

        // Temporary: verify the real response field names, remove once it works
        logger.info({ result }, "[createPayment] MyFatoorah response");

        payment.invoiceId = result.InvoiceId;
        payment.paymentUrl = result.PaymentURL;
        payment.status = "pending";

        await payment.save();

        return res.status(201).json({
            success: true,
            message: "Payment created successfully",
            data: {
                invoiceId: payment.invoiceId,
                paymentUrl: payment.paymentUrl,
            },
        });
    } catch (error) {
        logger.error(
            { err: error, orderId: order._id.toString() },
            "[createPayment] MyFatoorah failed",
        );
        throw new ErrorHandler("Unable to create payment", 502);
    }
});

export const paymentCallback = asyncHandler(async (req, res) => {
    const failedUrl = `${process.env.CLIENT_URL}/payment/failed`;

    logger.info({ query: req.query }, "[paymentCallback] received");

    const result = paymentCallbackSchema.safeParse(req.query);

    if (!result.success) {
        logger.warn(
            { issues: result.error.flatten() },
            "[paymentCallback] invalid query",
        );
        return res.redirect(failedUrl);
    }

    const { paymentId } = result.data;

    try {
        const paymentResult = await getMyFatoorahPayment(paymentId);

        // Temporary: check the real response shape, remove once it works
        logger.info({ paymentResult }, "[paymentCallback] MyFatoorah result");

        const invoiceStatus = paymentResult?.Invoice?.Status;
        const transaction = paymentResult?.Transaction;

        const payment = await Payment.findOne({
            invoiceId: paymentResult?.Invoice?.Id?.toString(),
        });

        if (!payment) {
            logger.warn(
                { invoiceId: paymentResult?.Invoice?.Id },
                "[paymentCallback] payment not found for invoice",
            );
            return res.redirect(failedUrl);
        }

        if (invoiceStatus === "PAID" && transaction?.Status === "SUCCESS") {
            const markResult = await markPaymentAsPaid({
                paymentId: payment._id,
                transaction,
            });

            logger.info({ markResult }, "[paymentCallback] markPaymentAsPaid");

            if (markResult === "paid") {
                return res.redirect(
                    `${process.env.CLIENT_URL}/payment/success?orderId=${payment.order}`,
                );
            }

            return res.redirect(
                `${process.env.CLIENT_URL}/payment/failed?orderId=${payment.order}`,
            );
        }

        logger.warn(
            { invoiceStatus, transactionStatus: transaction?.Status },
            "[paymentCallback] payment not marked as paid",
        );

        if (invoiceStatus === "EXPIRED" && payment.status === "pending") {
            await releaseStockForExpiredPayment({
                paymentId: payment._id,
                reason: "Invoice expired",
            });
        }

        return res.redirect(
            `${process.env.CLIENT_URL}/payment/failed?orderId=${payment.order}`,
        );
    } catch (error) {
        logger.error({ err: error }, "[paymentCallback] error");
        return res.redirect(failedUrl);
    }
});

export const myFatoorahWebhook = asyncHandler(async (req, res) => {
    if (!verifyMyFatoorahSignature(req)) {
        logger.warn("[webhook] invalid signature");

        return res.status(401).json({
            success: false,
            message: "Invalid webhook signature",
        });
    }

    const event = req.body;

    if (event?.Event?.Name !== "PAYMENT_STATUS_CHANGED") {
        return res.status(200).json({
            success: true,
            message: "Event ignored",
        });
    }

    const invoice = event.Data?.Invoice;
    const transaction = event.Data?.Transaction;

    if (!invoice?.Id) {
        return res.status(400).json({
            success: false,
            message: "Invoice ID missing",
        });
    }

    const payment = await Payment.findOne({
        invoiceId: invoice.Id.toString(),
    });

    if (!payment) {
        logger.warn({ invoiceId: invoice.Id }, "[webhook] payment not found");

        return res.status(404).json({
            success: false,
            message: "Payment not found",
        });
    }

    payment.lastWebhookAt = new Date();
    payment.lastWebhookReference = event.Event?.Reference;

    await payment.save();

    if (!transaction?.PaymentId) {
        return res.status(400).json({
            success: false,
            message: "Payment ID missing",
        });
    }

    const paymentResult = await getMyFatoorahPayment(transaction.PaymentId);

    const invoiceStatus = paymentResult?.Invoice?.Status;
    const latestTransaction = paymentResult?.Transaction;

    if (invoiceStatus === "PAID" && latestTransaction?.Status === "SUCCESS") {
        await markPaymentAsPaid({
            paymentId: payment._id,
            transaction: latestTransaction,
        });
    } else if (invoiceStatus === "EXPIRED" && payment.status === "pending") {
        await releaseStockForExpiredPayment({
            paymentId: payment._id,
            reason: "Invoice expired",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Webhook processed",
    });
});
