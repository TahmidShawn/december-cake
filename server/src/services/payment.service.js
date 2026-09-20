import mongoose from "mongoose";
import Payment from "../models/payment.model.js";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Cake from "../models/cake.model.js";

export const markPaymentAsPaid = async ({ paymentId, transaction }) => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const payment = await Payment.findById(paymentId).session(session);

            if (!payment) {
                throw new Error("Payment not found");
            }

            if (payment.status === "paid") {
                return;
            }

            const order = await Order.findById(payment.order).session(session);

            if (!order) {
                throw new Error("Order not found");
            }

            if (order.paymentStatus === "paid") {
                payment.status = "paid";
                payment.paidAt = payment.paidAt || new Date();

                await payment.save({ session });

                return;
            }

            const transactionExists = transaction?.PaymentId
                ? payment.transactions.some(
                      (item) => item.paymentId === transaction.PaymentId,
                  )
                : false;

            if (!transactionExists && transaction?.PaymentId) {
                payment.transactions.push({
                    paymentId: transaction.PaymentId,
                    transactionId: transaction.Id,
                    referenceId: transaction.ReferenceId,
                    status: transaction.Status,
                    paymentMethod: transaction.PaymentMethod,
                    amount:
                        Number(transaction.Amount?.ValueInPayCurrency) ||
                        payment.amount,
                    processedAt: transaction.TransactionDate
                        ? new Date(transaction.TransactionDate)
                        : new Date(),
                });
            }

            payment.status = "paid";
            payment.paidAt = new Date();

            order.paymentStatus = "paid";
            order.orderStatus = "confirmed";

            order.statusHistory.push({
                status: "confirmed",
                note: "Payment received, order confirmed",
            });

            await payment.save({ session });
            await order.save({ session });

            await Cart.updateOne(
                {
                    user: order.user,
                },
                {
                    $pull: {
                        items: {
                            cake: {
                                $in: order.items.map((item) => item.cake),
                            },
                        },
                    },
                },
                { session },
            );
        });
    } finally {
        await session.endSession();
    }
};

export const releaseStockForFailedPayment = async ({ paymentId, reason }) => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const payment = await Payment.findById(paymentId).session(session);

            if (!payment) {
                throw new Error("Payment not found");
            }

            if (
                payment.status === "failed" ||
                payment.status === "cancelled" ||
                payment.status === "expired"
            ) {
                return;
            }

            const order = await Order.findById(payment.order).session(session);

            if (!order) {
                throw new Error("Order not found");
            }

            for (const item of order.items) {
                await Cake.updateOne(
                    {
                        _id: item.cake,
                    },
                    {
                        $inc: {
                            stock: item.quantity,
                        },
                    },
                    { session },
                );
            }

            payment.status = "failed";
            payment.failedAt = new Date();
            payment.failureReason = reason || "Payment failed";

            order.paymentStatus = "failed";
            order.orderStatus = "cancelled";
            order.cancelledAt = new Date();
            order.cancellationReason = "Payment failed";

            order.statusHistory.push({
                status: "cancelled",
                note: "Order cancelled because payment failed",
            });

            await payment.save({ session });
            await order.save({ session });
        });
    } finally {
        await session.endSession();
    }
};