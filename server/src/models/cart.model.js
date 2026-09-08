import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        items: {
            type: [
                {
                    cake: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Cake",
                        required: true,
                    },
                    quantity: {
                        type: Number,
                        required: true,
                        min: 1,
                        max: 50,
                        default: 1,
                    },
                    _id: false,
                },
            ],
            validate: {
                validator: (items) => items.length <= 50,
                message: "Cart cannot contain more than 50 items",
            },
        },
    },
    { timestamps: true },
);

// clean up in 60 days if unused
cartSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 60 * 24 * 60 * 60 });

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;
