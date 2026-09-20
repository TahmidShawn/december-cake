import Payment from "../models/payment.model.js";
import Order from "../models/order.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import asyncHandler from "../utils/asyncHandler.js";
import { paymentCallbackSchema } from "../validations/payment.validation.js";
import {
    createMyFatoorahPayment,
    getMyFatoorahPayment,
} from "../services/myfatoorah.service.js";
import {
    markPaymentAsPaid,
    releaseStockForFailedPayment,
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

    if (
        order.orderStatus === "cancelled" ||
        order.orderStatus === "delivered"
    ) {
        throw new ErrorHandler("This order can no longer be paid", 400);
    }

    let payment = await Payment.findOne({
        order: order._id,
    });

    if (payment?.status === "paid") {
        throw new ErrorHandler("This order has already been paid", 400);
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

        payment.invoiceId = result.InvoiceId;
        payment.paymentUrl = result.PaymentURL;
        payment.status = "pending";

        if (result.PaymentId) {
            payment.transactions.push({
                paymentId: result.PaymentId,
            });
        }

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
        throw new ErrorHandler("Unable to create payment", 502);
    }
});

export const paymentCallback = asyncHandler(async (req, res) => {
    const result = paymentCallbackSchema.safeParse(req.query);

    // Validate callback
    if (!result.success) {
        return res.redirect(`${process.env.CLIENT_URL}/payment/failed`);
    }

    const { paymentId } = result.data;

    try {
        const paymentResult = await getMyFatoorahPayment(paymentId);

        const invoiceStatus = paymentResult?.Invoice?.Status;
        const transaction = paymentResult?.Transaction;

        const payment = await Payment.findOne({
            invoiceId: paymentResult?.Invoice?.Id?.toString(),
        });

        if (!payment) {
            return res.redirect(`${process.env.CLIENT_URL}/payment/failed`);
        }

        // Complete successful payment
        if (invoiceStatus === "PAID" && transaction?.Status === "SUCCESS") {
            await markPaymentAsPaid({
                paymentId: payment._id,
                transaction,
            });

            return res.redirect(
                `${process.env.CLIENT_URL}/payment/success?orderId=${payment.order}`,
            );
        }

        // Release stock after invoice expiry
        if (invoiceStatus === "EXPIRED" && payment.status === "pending") {
            await releaseStockForFailedPayment({
                paymentId: payment._id,
                reason: "Invoice expired",
            });
        }

        return res.redirect(
            `${process.env.CLIENT_URL}/payment/failed?orderId=${payment.order}`,
        );
    } catch (error) {
        return res.redirect(`${process.env.CLIENT_URL}/payment/failed`);
    }
});

export const myFatoorahWebhook = asyncHandler(async (req, res) => {
    if (!verifyMyFatoorahSignature(req)) {
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
        return res.status(404).json({
            success: false,
            message: "Payment not found",
        });
    }

    payment.lastWebhookAt = new Date();
    payment.lastWebhookReference = event.Event?.Reference;

    // Complete successful payment
    if (invoice.Status === "PAID" && transaction?.Status === "SUCCESS") {
        await payment.save();

        await markPaymentAsPaid({
            paymentId: payment._id,
            transaction,
        });
    }

    // Release stock after invoice expiry
    else if (invoice.Status === "EXPIRED" && payment.status === "pending") {
        await payment.save();

        await releaseStockForFailedPayment({
            paymentId: payment._id,
            reason: "Invoice expired",
        });
    } else {
        await payment.save();
    }

    return res.status(200).json({
        success: true,
        message: "Webhook processed",
    });
});
