import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
    {
        label: { type: String, default: "Home" },
        fullName: {
            type: String,
            required: [true, "Please enter the recipient's name"],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, "Please enter a phone number"],
            match: [
                /^(\+965)?[569]\d{7}$/,
                "Please enter a valid Kuwait phone number",
            ],
        },
        governorate: {
            type: String,
            enum: {
                values: [
                    "Al Asimah",
                    "Hawalli",
                    "Farwaniya",
                    "Mubarak Al-Kabeer",
                    "Ahmadi",
                    "Jahra",
                ],
                message: "Please select a valid governorate",
            },
            required: [true, "Please select a governorate"],
        },
        area: {
            type: String,
            required: [true, "Please enter the area"],
            trim: true,
        },
        block: {
            type: String,
            required: [true, "Please enter the block number"],
            trim: true,
        },
        street: {
            type: String,
            required: [true, "Please enter the street"],
            trim: true,
        },
        building: {
            type: String,
            required: [true, "Please enter the building number"],
            trim: true,
        },
        floor: { type: String, trim: true },
        apartmentNo: { type: String, trim: true },
        notes: {
            type: String,
            maxLength: [300, "Notes cannot exceed 300 characters"],
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number],
                validate: {
                    validator: (val) => !val || val.length === 2,
                    message: "Coordinates must be [longitude, latitude]",
                },
            },
        },

        isDefault: { type: Boolean, default: false },
    },
    { timestamps: true },
);

addressSchema.index({ location: "2dsphere" }, { sparse: true });

export default addressSchema;
