import mongoose from "mongoose";
import Order, { ORDER_STATUSES } from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Cake from "../models/cake.model.js";
import AddOn from "../models/addOn.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createOrder = asyncHandler(async (req, res) => {
    const {
        paymentMethod,
        cakeIds = [],
        addOns = [],
        shippingAddress,
    } = req.body;

    if (!Array.isArray(cakeIds)) {
        throw new ErrorHandler("Invalid cake selection", 400);
    }

    if (!Array.isArray(addOns)) {
        throw new ErrorHandler("Invalid add-on selection", 400);
    }

    const session = await mongoose.startSession();

    try {
        let createdOrder;

        await session.withTransaction(async () => {
            const cart = await Cart.findOne({
                user: req.user._id,
            }).session(session);

            if (!cart) {
                throw new ErrorHandler("Your cart is empty", 400);
            }

            /*
             * A valid order can contain:
             *
             * - cakes only
             * - add-ons only
             * - cakes + add-ons
             *
             * It is only invalid when both selections are empty.
             */
            if (!cakeIds.length && !addOns.length) {
                throw new ErrorHandler(
                    "Please select at least one cake or add-on to place an order",
                    400,
                );
            }

            /*
             * ---------------------------------------------------------
             * CAKES
             * ---------------------------------------------------------
             */

            const selectedCartItems = cart.items.filter((item) =>
                cakeIds.includes(item.cake.toString()),
            );

            /*
             * If cake IDs were supplied, every selected cake must exist
             * in the user's cart.
             *
             * For add-on-only orders cakeIds is [] and this block simply
             * does nothing.
             */
            if (cakeIds.length && selectedCartItems.length !== cakeIds.length) {
                throw new ErrorHandler(
                    "One or more selected cakes are not in your cart",
                    400,
                );
            }

            const selectedCakeIds = selectedCartItems.map((item) => item.cake);

            const orderItems = [];
            let subtotal = 0;

            /*
             * Only query Cake documents when cakes were selected.
             */
            if (selectedCakeIds.length) {
                const cakes = await Cake.find({
                    _id: { $in: selectedCakeIds },
                    isActive: true,
                }).session(session);

                if (cakes.length !== selectedCakeIds.length) {
                    throw new ErrorHandler(
                        "One or more selected cakes are no longer available",
                        400,
                    );
                }

                const cakeMap = new Map(
                    cakes.map((cake) => [cake._id.toString(), cake]),
                );

                for (const cartItem of selectedCartItems) {
                    const cake = cakeMap.get(cartItem.cake.toString());

                    if (!cake) {
                        throw new ErrorHandler(
                            "One or more selected cakes are no longer available",
                            400,
                        );
                    }

                    if (cake.stock < cartItem.quantity) {
                        throw new ErrorHandler(
                            `Insufficient stock for "${cake.name.en}"`,
                            400,
                        );
                    }

                    if (cake.price == null || cake.price < 0) {
                        throw new ErrorHandler(
                            `Invalid price for "${cake.name.en}"`,
                            500,
                        );
                    }

                    /*
                     * Keep the existing backend pricing behavior:
                     * the order uses the current Cake.price.
                     */
                    const itemTotal = cake.price * cartItem.quantity;

                    subtotal += itemTotal;

                    orderItems.push({
                        cake: cake._id,
                        name: {
                            en: cake.name.en,
                            ar: cake.name.ar,
                        },
                        imageUrl: cake.images?.[0]?.url,
                        price: cake.price,
                        quantity: cartItem.quantity,
                        totalPrice: itemTotal,
                    });
                }
            }

            /*
             * ---------------------------------------------------------
             * ADD-ONS
             * ---------------------------------------------------------
             */

            const orderAddOns = [];
            const selectedAddOnIds = [];

            if (addOns.length) {
                const addOnIds = addOns.map((item) => item.addOnId);

                /*
                 * Do not allow the same add-on to appear multiple
                 * times in the order payload.
                 */
                const uniqueAddOnIds = new Set(
                    addOnIds.map((id) => id.toString()),
                );

                if (uniqueAddOnIds.size !== addOnIds.length) {
                    throw new ErrorHandler(
                        "Duplicate add-ons are not allowed",
                        400,
                    );
                }

                /*
                 * Make sure every requested add-on actually exists
                 * in the user's cart.
                 */
                const cartAddOnIds = new Set(
                    cart.addOns.map((item) => item.addOn.toString()),
                );

                for (const addOnId of addOnIds) {
                    if (!cartAddOnIds.has(addOnId.toString())) {
                        throw new ErrorHandler(
                            "One or more selected add-ons are not in your cart",
                            400,
                        );
                    }
                }

                /*
                 * Get the latest AddOn documents from the database.
                 */
                const addOnDocuments = await AddOn.find({
                    _id: { $in: addOnIds },
                    isActive: true,
                }).session(session);

                if (addOnDocuments.length !== addOnIds.length) {
                    throw new ErrorHandler(
                        "One or more selected add-ons are no longer available",
                        400,
                    );
                }

                const addOnMap = new Map(
                    addOnDocuments.map((addOn) => [
                        addOn._id.toString(),
                        addOn,
                    ]),
                );

                for (const selectedAddOn of addOns) {
                    const addOn = addOnMap.get(
                        selectedAddOn.addOnId.toString(),
                    );

                    if (!addOn) {
                        throw new ErrorHandler(
                            "One or more selected add-ons are no longer available",
                            400,
                        );
                    }

                    if (
                        !Number.isInteger(selectedAddOn.quantity) ||
                        selectedAddOn.quantity < 1 ||
                        selectedAddOn.quantity > 50
                    ) {
                        throw new ErrorHandler(
                            "Add-on quantity must be between 1 and 50",
                            400,
                        );
                    }

                    const cartAddOn = cart.addOns.find(
                        (item) =>
                            item.addOn.toString() ===
                            selectedAddOn.addOnId.toString(),
                    );

                    if (!cartAddOn) {
                        throw new ErrorHandler(
                            "One or more selected add-ons are not in your cart",
                            400,
                        );
                    }

                    /*
                     * The order cannot contain more add-ons than
                     * the quantity currently stored in the cart.
                     */
                    if (selectedAddOn.quantity > cartAddOn.quantity) {
                        throw new ErrorHandler(
                            "Add-on quantity exceeds the quantity in your cart",
                            400,
                        );
                    }

                    const addOnTotal = addOn.price * selectedAddOn.quantity;

                    subtotal += addOnTotal;

                    selectedAddOnIds.push(addOn._id);

                    orderAddOns.push({
                        addOn: addOn._id,
                        name: {
                            en: addOn.name.en,
                            ar: addOn.name.ar,
                        },
                        imageUrl: addOn.imageUrl,
                        price: addOn.price,
                        quantity: selectedAddOn.quantity,
                        totalPrice: addOnTotal,
                    });
                }
            }

            /*
             * ---------------------------------------------------------
             * ORDER TOTAL
             * ---------------------------------------------------------
             */

            const discount = 0;
            const deliveryFee = 0;

            const totalPrice = subtotal - discount + deliveryFee;

            /*
             * ---------------------------------------------------------
             * CREATE ORDER
             * ---------------------------------------------------------
             */

            const [order] = await Order.create(
                [
                    {
                        user: req.user._id,
                        shippingAddress,
                        items: orderItems,
                        addOns: orderAddOns,
                        paymentMethod,
                        paymentStatus: "pending",
                        subtotal,
                        discount,
                        deliveryFee,
                        totalPrice,
                        orderStatus: "pending",
                        statusHistory: [
                            {
                                status: "pending",
                                note:
                                    paymentMethod === "online"
                                        ? "Order created and awaiting payment"
                                        : "Order placed",
                            },
                        ],
                    },
                ],
                { session },
            );

            /*
             * ---------------------------------------------------------
             * RESERVE CAKE STOCK
             * ---------------------------------------------------------
             *
             * Nothing happens here for add-on-only orders.
             */
            for (const cartItem of selectedCartItems) {
                const result = await Cake.updateOne(
                    {
                        _id: cartItem.cake,
                        isActive: true,
                        stock: {
                            $gte: cartItem.quantity,
                        },
                    },
                    {
                        $inc: {
                            stock: -cartItem.quantity,
                        },
                    },
                    { session },
                );

                if (result.modifiedCount !== 1) {
                    throw new ErrorHandler(
                        "Stock changed while placing the order. Please try again",
                        409,
                    );
                }
            }

            /*
             * ---------------------------------------------------------
             * CART CLEANUP
             * ---------------------------------------------------------
             *
             * COD:
             * The order is already confirmed as placed, so remove
             * the ordered quantities from the cart immediately.
             *
             * ONLINE:
             * Keep the cart unchanged until payment succeeds.
             */
            if (paymentMethod === "cash_on_delivery") {
                /*
                 * Remove the selected cake cart items.
                 *
                 * Cake checkout currently orders the complete cart
                 * quantity for each selected cake, so pulling the
                 * selected cake IDs is correct.
                 */
                if (selectedCakeIds.length) {
                    await Cart.updateOne(
                        {
                            _id: cart._id,
                            user: req.user._id,
                        },
                        {
                            $pull: {
                                items: {
                                    cake: {
                                        $in: selectedCakeIds,
                                    },
                                },
                            },
                        },
                        { session },
                    );
                }

                /*
                 * Add-ons need quantity-aware cleanup.
                 *
                 * If the user has:
                 *
                 * Cart:     3 candles
                 * Order:    1 candle
                 *
                 * Cart must become:
                 *
                 * Cart:     2 candles
                 *
                 * It should NOT remove the entire add-on item.
                 */
                for (const selectedAddOn of orderAddOns) {
                    const cartAddOn = cart.addOns.find(
                        (item) =>
                            item.addOn.toString() ===
                            selectedAddOn.addOn.toString(),
                    );

                    if (!cartAddOn) {
                        continue;
                    }

                    const remainingQuantity =
                        cartAddOn.quantity - selectedAddOn.quantity;

                    if (remainingQuantity <= 0) {
                        await Cart.updateOne(
                            {
                                _id: cart._id,
                                user: req.user._id,
                            },
                            {
                                $pull: {
                                    addOns: {
                                        addOn: selectedAddOn.addOn,
                                    },
                                },
                            },
                            { session },
                        );
                    } else {
                        await Cart.updateOne(
                            {
                                _id: cart._id,
                                user: req.user._id,
                                "addOns.addOn": selectedAddOn.addOn,
                            },
                            {
                                $set: {
                                    "addOns.$.quantity": remainingQuantity,
                                },
                            },
                            { session },
                        );
                    }
                }
            }

            createdOrder = order;
        });

        return res.status(201).json({
            success: true,
            message:
                paymentMethod === "online"
                    ? "Order created. Complete payment to continue."
                    : "Order created successfully",
            data: createdOrder,
        });
    } finally {
        await session.endSession();
    }
});

export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({
        user: req.user._id,
    }).sort({
        createdAt: -1,
    });

    res.status(200).json({
        success: true,
        message: "Orders fetched successfully",
        data: orders,
    });
});

export const getMyOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const order = await Order.findOne({
        _id: id,
        user: req.user._id,
    });

    if (!order) {
        throw new ErrorHandler("Order not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Order fetched successfully",
        data: order,
    });
});

export const cancelMyOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const session = await mongoose.startSession();

    try {
        let cancelledOrder;

        await session.withTransaction(async () => {
            const order = await Order.findOne({
                _id: id,
                user: req.user._id,
            }).session(session);

            if (!order) {
                throw new ErrorHandler("Order not found", 404);
            }

            if (order.paymentMethod !== "cash_on_delivery") {
                throw new ErrorHandler(
                    "Online orders cannot be cancelled",
                    400,
                );
            }

            if (order.orderStatus !== "pending") {
                throw new ErrorHandler(
                    "Only pending COD orders can be cancelled",
                    400,
                );
            }

            /*
             * Restore reserved cake stock.
             *
             * Add-ons do not have stock reservation here,
             * so there is nothing to restore for add-ons.
             */
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

            order.orderStatus = "cancelled";
            order.cancelledAt = new Date();
            order.cancellationReason = "Cancelled by customer";

            order.statusHistory.push({
                status: "cancelled",
                note: "Order cancelled by customer",
            });

            await order.save({ session });

            cancelledOrder = order;
        });

        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            data: cancelledOrder,
        });
    } finally {
        await session.endSession();
    }
});

export const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find()
        .populate("user", "username email phone")
        .sort({
            createdAt: -1,
        });

    res.status(200).json({
        success: true,
        message: "Orders fetched successfully",
        data: orders,
    });
});

export const getOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const order = await Order.findById(id).populate(
        "user",
        "username email phone",
    );

    if (!order) {
        throw new ErrorHandler("Order not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Order fetched successfully",
        data: order,
    });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!ORDER_STATUSES.includes(status)) {
        throw new ErrorHandler("Invalid order status", 400);
    }

    const session = await mongoose.startSession();

    try {
        let updatedOrder;

        await session.withTransaction(async () => {
            const order = await Order.findById(id).session(session);

            if (!order) {
                throw new ErrorHandler("Order not found", 404);
            }

            if (
                order.orderStatus === "delivered" ||
                order.orderStatus === "cancelled"
            ) {
                throw new ErrorHandler(
                    "Finalized orders cannot be updated",
                    400,
                );
            }

            /*
             * -----------------------------------------------------
             * CANCEL ORDER
             * -----------------------------------------------------
             */

            if (status === "cancelled") {
                if (order.paymentMethod !== "cash_on_delivery") {
                    throw new ErrorHandler(
                        "Online orders cannot be cancelled",
                        400,
                    );
                }

                if (order.orderStatus !== "pending") {
                    throw new ErrorHandler(
                        "Only pending COD orders can be cancelled",
                        400,
                    );
                }

                /*
                 * Restore cake stock.
                 */
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

                order.cancelledAt = new Date();
                order.cancellationReason = "Cancelled by admin";

                order.statusHistory.push({
                    status: "cancelled",
                    note: "Order cancelled by admin",
                });

                order.orderStatus = "cancelled";

                await order.save({ session });

                updatedOrder = order;

                return;
            }

            /*
             * -----------------------------------------------------
             * ONLINE PAYMENT VALIDATION
             * -----------------------------------------------------
             */

            if (
                status === "confirmed" &&
                order.paymentMethod === "online" &&
                order.paymentStatus !== "paid"
            ) {
                throw new ErrorHandler(
                    "Online order must be paid before confirmation",
                    400,
                );
            }

            /*
             * -----------------------------------------------------
             * STATUS TRANSITIONS
             * -----------------------------------------------------
             */

            const allowedTransitions = {
                pending: ["confirmed"],
                confirmed: ["out_for_delivery"],
                out_for_delivery: ["delivered"],
            };

            const allowedNextStatuses =
                allowedTransitions[order.orderStatus] || [];

            if (!allowedNextStatuses.includes(status)) {
                throw new ErrorHandler(
                    `Cannot change order status from "${order.orderStatus}" to "${status}"`,
                    400,
                );
            }

            order.statusHistory.push({
                status,
                note: `Order status changed to ${status}`,
            });

            order.orderStatus = status;

            await order.save({ session });

            updatedOrder = order;
        });

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: updatedOrder,
        });
    } finally {
        await session.endSession();
    }
});
