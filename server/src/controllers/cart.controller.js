import Cart from "../models/cart.model.js";
import Cake from "../models/cake.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import asyncHandler from "../utils/asyncHandler.js";
import { calculateCartTotals } from "../services/cart.service.js";

export const addCartItem = asyncHandler(async (req, res) => {
    const { cakeId, quantity } = req.body;

    const cake = await Cake.findById(cakeId);

    if (!cake) {
        throw new ErrorHandler("Cake not found", 404);
    }

    if (!cake.isActive) {
        throw new ErrorHandler("This cake is not available", 400);
    }

    if (cake.stock < 1) {
        throw new ErrorHandler("This cake is out of stock", 400);
    }

    if (quantity > cake.stock) {
        throw new ErrorHandler(
            `Only ${cake.stock} item${cake.stock === 1 ? "" : "s"} available`,
            400,
        );
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({
            user: req.user._id,
            items: [
                {
                    cake: cakeId,
                    quantity,
                },
            ],
        });
    } else {
        const existingItem = cart.items.find(
            (item) => item.cake.toString() === cakeId,
        );

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;

            if (newQuantity > 50) {
                throw new ErrorHandler(
                    "A cart item cannot have more than 50 units",
                    400,
                );
            }

            if (newQuantity > cake.stock) {
                throw new ErrorHandler(
                    `Only ${cake.stock} item${cake.stock === 1 ? "" : "s"} available`,
                    400,
                );
            }

            existingItem.quantity = newQuantity;
        } else {
            if (cart.items.length >= 50) {
                throw new ErrorHandler(
                    "Cart cannot contain more than 50 items",
                    400,
                );
            }

            cart.items.push({
                cake: cakeId,
                quantity,
            });
        }

        await cart.save();
    }

    await cart.populate({
        path: "items.cake",
        select: "name images price discountPercentage isActive stock slug",
    });

    res.status(200).json({
        success: true,
        message: "Item added to cart successfully",
        data: cart,
    });
});

export const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({
        user: req.user._id,
    }).populate({
        path: "items.cake",
        select: "name images price discountPercentage isActive stock slug",
    });

    if (!cart) {
        return res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            data: {
                items: [],
                totalItems: 0,
                subtotal: "0.000",
            },
        });
    }

    const { subtotal, totalItems } = calculateCartTotals(cart);

    res.status(200).json({
        success: true,
        message: "Cart fetched successfully",
        data: {
            ...cart.toJSON(),
            totalItems,
            subtotal: subtotal.toFixed(3),
        },
    });
});

export const updateCartItem = asyncHandler(async (req, res) => {
    const { cakeId } = req.params;
    const { quantity } = req.body;

    const cake = await Cake.findById(cakeId);

    if (!cake) {
        throw new ErrorHandler("Cake not found", 404);
    }

    if (!cake.isActive) {
        throw new ErrorHandler("This cake is not available", 400);
    }

    if (cake.stock < 1) {
        throw new ErrorHandler("This cake is out of stock", 400);
    }

    if (quantity > cake.stock) {
        throw new ErrorHandler(
            `Only ${cake.stock} item${cake.stock === 1 ? "" : "s"} available`,
            400,
        );
    }

    const cart = await Cart.findOne({
        user: req.user._id,
    });

    if (!cart) {
        throw new ErrorHandler("Cart not found", 404);
    }

    const item = cart.items.find(
        (cartItem) => cartItem.cake.toString() === cakeId,
    );

    if (!item) {
        throw new ErrorHandler("Cake is not in your cart", 404);
    }

    item.quantity = quantity;

    await cart.save();

    await cart.populate({
        path: "items.cake",
        select: "name images price discountPercentage isActive stock slug",
    });

    res.status(200).json({
        success: true,
        message: "Cart item updated successfully",
        data: cart,
    });
});

export const removeCartItem = asyncHandler(async (req, res) => {
    const { cakeId } = req.params;

    const cart = await Cart.findOne({
        user: req.user._id,
    });

    if (!cart) {
        throw new ErrorHandler("Cart not found", 404);
    }

    const itemExists = cart.items.some(
        (item) => item.cake.toString() === cakeId,
    );

    if (!itemExists) {
        throw new ErrorHandler("Cake is not in your cart", 404);
    }

    cart.items = cart.items.filter((item) => item.cake.toString() !== cakeId);

    await cart.save();

    await cart.populate({
        path: "items.cake",
        select: "name images price discountPercentage isActive stock slug",
    });

    res.status(200).json({
        success: true,
        message: "Item removed from cart successfully",
        data: cart,
    });
});

export const clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({
        user: req.user._id,
    });

    if (!cart) {
        return res.status(200).json({
            success: true,
            message: "Cart is already empty",
            data: {
                items: [],
            },
        });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
        success: true,
        message: "Cart cleared successfully",
        data: cart,
    });
});
