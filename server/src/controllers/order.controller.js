import mongoose from "mongoose";
import Order, { ORDER_STATUSES } from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Cake from "../models/cake.model.js";
import AddOn from "../models/addOn.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createOrder = asyncHandler(async (req, res) => {
    const { paymentMethod, cakeIds, addOns = [], shippingAddress } = req.body;

    const session = await mongoose.startSession();

    try {
        let createdOrder;

        await session.withTransaction(async () => {
            const cart = await Cart.findOne({
                user: req.user._id,
            }).session(session);

            if (!cart || !cart.items.length) {
                throw new ErrorHandler("Your cart is empty", 400);
            }

            // get selected cart items
            const selectedCartItems = cart.items.filter((item) =>
                cakeIds.includes(item.cake.toString()),
            );

            if (!selectedCartItems.length) {
                throw new ErrorHandler(
                    "Please select at least one item to place an order",
                    400,
                );
            }

            // check selected cakes are in cart
            if (selectedCartItems.length !== cakeIds.length) {
                throw new ErrorHandler(
                    "One or more selected items are not in your cart",
                    400,
                );
            }

            const selectedCakeIds = selectedCartItems.map((item) => item.cake);

            // get latest cake data
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

            const orderItems = [];
            let subtotal = 0;

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

            const orderAddOns = [];

            // get selected add-ons
            if (addOns.length) {
                const addOnIds = addOns.map((item) => item.addOnId);

                const uniqueAddOnIds = new Set(addOnIds);

                if (uniqueAddOnIds.size !== addOnIds.length) {
                    throw new ErrorHandler(
                        "Duplicate add-ons are not allowed",
                        400,
                    );
                }

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
                    const addOn = addOnMap.get(selectedAddOn.addOnId);

                    if (!addOn) {
                        throw new ErrorHandler(
                            "One or more selected add-ons are no longer available",
                            400,
                        );
                    }

                    if (
                        !Number.isInteger(selectedAddOn.quantity) ||
                        selectedAddOn.quantity < 1
                    ) {
                        throw new ErrorHandler(
                            "Add-on quantity must be at least 1",
                            400,
                        );
                    }

                    const addOnTotal = addOn.price * selectedAddOn.quantity;

                    subtotal += addOnTotal;

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

            const discount = 0;
            const deliveryFee = 0;
            const totalPrice = subtotal - discount + deliveryFee;

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

            // reserve cake stock
            for (const cartItem of selectedCartItems) {
                const result = await Cake.updateOne(
                    {
                        _id: cartItem.cake,
                        isActive: true,
                        stock: { $gte: cartItem.quantity },
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

            // remove selected cakes from cart
            if (paymentMethod === "cash_on_delivery") {
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
