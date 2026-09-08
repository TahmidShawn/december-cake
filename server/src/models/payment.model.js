import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            index: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        gateway: {
            type: String,
            enum: ["myfatoorah", "cash_on_delivery"],
            required: true,
        },

        invoiceId: { type: String, index: true },
        paymentId: { type: String },
        invoiceReference: { type: String },

        paymentGatewayUsed: { type: String },

        gatewayResponse: { type: mongoose.Schema.Types.Mixed },

        amountFils: { type: Number, required: true },

        status: {
            type: String,
            enum: ["initiated", "success", "failed", "refunded"],
            default: "initiated",
            index: true,
        },

        failureReason: { type: String },

        refundedAmountFils: { type: Number },
        refundedAt: { type: Date },
    },
    { timestamps: true },
);

paymentSchema.index({ invoiceId: 1 });

const Payment =
    mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export default Payment;
