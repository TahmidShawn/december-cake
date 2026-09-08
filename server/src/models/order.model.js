import mongoose from "mongoose";

export const ORDER_STATUSES = [
    "pending",
    "confirmed",
    "baking",
    "ready_for_delivery",
    "out_for_delivery",
    "delivered",
    "cancelled",
];

const orderSchema = new mongoose.Schema(
    {
        orderNumber: { type: String, required: true, unique: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        addressId: { type: mongoose.Schema.Types.ObjectId },

        shippingAddress: {
            fullName: { type: String, required: true },
            phone: {
                type: String,
                required: true,
                match: [/^(\+965)?[569]\d{7}$/, "Invalid Kuwait phone number"],
            },
            governorate: {
                type: String,
                enum: [
                    "Al Asimah",
                    "Hawalli",
                    "Farwaniya",
                    "Mubarak Al-Kabeer",
                    "Ahmadi",
                    "Jahra",
                ],
                required: true,
            },
            area: { type: String, required: true },
            block: { type: String, required: true },
            street: { type: String, required: true },
            building: { type: String, required: true },
            floor: { type: String },
            apartmentNo: { type: String },
            notes: { type: String, maxLength: 300 },
        },

        items: [
            {
                cake: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Cake",
                    required: true,
                },
                name: {
                    en: { type: String, required: true },
                    ar: { type: String, required: true },
                },
                imageUrl: { type: String },
                specialInstructions: {
                    type: String,
                    maxLength: [
                        500,
                        "Instructions cannot exceed 500 characters",
                    ],
                    trim: true,
                },
                pricePerUnitFils: { type: Number, required: true },
                quantity: { type: Number, required: true, min: 1 },
                totalPriceFils: { type: Number, required: true },
                _id: false,
            },
        ],

        preferredDeliveryDate: { type: Date, required: true },
        preferredDeliveryTimeSlot: { type: String },

        paymentMethod: {
            type: String,
            enum: ["online", "cash_on_delivery"],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },

        subtotalFils: { type: Number, required: true },
        discountFils: { type: Number, default: 0 },
        deliveryFeeFils: { type: Number, required: true, default: 0 },
        totalFils: { type: Number, required: true },

        orderStatus: {
            type: String,
            enum: ORDER_STATUSES,
            default: "pending",
        },
        statusHistory: {
            type: [
                {
                    status: {
                        type: String,
                        enum: ORDER_STATUSES,
                        required: true,
                    },
                    note: { type: String },
                    changedAt: { type: Date, default: Date.now },
                    _id: false,
                },
            ],
            default: [],
        },
        deliveredAt: { type: Date },

        adminNotes: { type: String },
        cancelledAt: { type: Date },
        cancellationReason: { type: String },
    },
    { timestamps: true },
);

orderSchema.pre("validate", function generateOrderNumber(next) {
    if (this.isNew && !this.orderNumber) {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.floor(1000 + Math.random() * 9000);
        this.orderNumber = `ORD-${timestamp}${random}`;
    }
    next();
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
