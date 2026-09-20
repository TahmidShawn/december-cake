import cron from "node-cron";
import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Cake from "../models/cake.model.js";
import logger from "../utils/logger.js";


const ORDER_EXPIRY_MINUTES = 30;


export const expireStaleOrders = async () => {
    const cutoff = new Date(Date.now() - ORDER_EXPIRY_MINUTES * 60 * 1000);

    const staleOrders = await Order.find({
        orderStatus: "pending",
        paymentStatus: "pending",
        paymentMethod: "online",
        createdAt: { $lte: cutoff },
    }).select("_id");

    if (!staleOrders.length) {
        return { cancelled: 0, failed: 0 };
    }

    let cancelledCount = 0;
    let failedCount = 0;

    for (const { _id } of staleOrders) {
        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                const order = await Order.findById(_id).session(session);

                if (
                    !order ||
                    order.orderStatus !== "pending" ||
                    order.paymentStatus !== "pending"
                ) {
                    return;
                }

                for (const item of order.items) {
                    await Cake.updateOne(
                        { _id: item.cake },
                        { $inc: { stock: item.quantity } },
                        { session },
                    );
                }

                order.orderStatus = "cancelled";
                order.paymentStatus = "failed";
                order.cancelledAt = new Date();
                order.cancellationReason = `Auto-cancelled: payment not completed within ${ORDER_EXPIRY_MINUTES} minutes`;

                order.statusHistory.push({
                    status: "cancelled",
                    note: order.cancellationReason,
                });

                await order.save({ session });
            });

            cancelledCount += 1;
        } catch (error) {
            failedCount += 1;
            logger.error(
                { err: error, orderId: _id },
                "[orderExpiry] Failed to auto-cancel order",
            );
        } finally {
            await session.endSession();
        }
    }

    if (cancelledCount || failedCount) {
        logger.info(
            { cancelled: cancelledCount, failed: failedCount },
            "[orderExpiry] Run complete",
        );
    }

    return { cancelled: cancelledCount, failed: failedCount };
};



export const scheduleOrderExpiryJob = () => {
    cron.schedule("*/5 * * * *", () => {
        expireStaleOrders().catch((error) => {
            logger.error({ err: error }, "[orderExpiry] Unexpected job error");
        });
    });

    logger.info(
        `[orderExpiry] Scheduled — checking every 5 minutes for pending online orders older than ${ORDER_EXPIRY_MINUTES} minutes`,
    );
};
