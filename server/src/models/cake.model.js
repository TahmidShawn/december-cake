import mongoose from "mongoose";
import generateSlug from "../utils/generateSlug.js";

const cakeSchema = new mongoose.Schema(
    {
        name: {
            en: {
                type: String,
                required: [true, "Please enter product name in English"],
                trim: true,
                minLength: [3, "Product name must be at least 3 characters"],
                maxLength: [150, "Product name cannot exceed 150 characters"],
            },
            ar: {
                type: String,
                required: [true, "Please enter product name in Arabic"],
                trim: true,
                minLength: [3, "Product name must be at least 3 characters"],
                maxLength: [150, "Product name cannot exceed 150 characters"],
            },
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            en: {
                type: String,
                required: [true, "Please enter product description in English"],
                minLength: [10, "Description must be at least 10 characters"],
                maxLength: [1000, "Description cannot exceed 1000 characters"],
            },
            ar: {
                type: String,
                required: [true, "Please enter product description in Arabic"],
                minLength: [10, "Description must be at least 10 characters"],
                maxLength: [1000, "Description cannot exceed 1000 characters"],
            },
        },

        images: {
            type: [
                {
                    url: { type: String, required: true },
                    fileId: { type: String, required: true },
                    _id: false,
                },
            ],
            required: [true, "Please upload at least one product image"],
            validate: {
                validator: (images) => images && images.length > 0,
                message: "At least one image is required",
            },
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Please select a category"],
            index: true,
        },
        weightInLbs: {
            type: Number,
            required: [true, "Please enter the cake weight in pounds"],
            min: [1, "Weight must be at least 1 lbs"],
        },
        servings: {
            type: Number,
            min: 0,
            default: 0,
            help: "Approximate number of people this cake serves",
        },
        priceInFils: {
            type: Number,
            required: [true, "Please enter product price"],
            min: [0, "Price cannot be negative"],
        },
        discountPercentage: {
            type: Number,
            default: 0,
            min: [0, "Discount cannot be negative"],
            max: [100, "Discount cannot exceed 100%"],
        },
        stock: {
            type: Number,
            required: [true, "Please enter product stock"],
            min: [0, "Stock cannot be negative"],
            default: 0,
        },
        isFeatured: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        avgRating: { type: Number, default: 0, min: 0, max: 5 },
        numReviews: { type: Number, default: 0 },
        salesCount: { type: Number, default: 0 },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        tags: [String],
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete ret.__v;
                return ret;
            },
        },
    },
);

// generate slug from the english name
cakeSchema.pre("validate", function generateCakeSlug() {
    if (this.name?.en && (!this.slug || this.isModified("name.en"))) {
        this.slug = generateSlug(this.name.en);
    }
});

// discounted price
cakeSchema.virtual("discountedPriceInFils").get(function () {
    if (!this.discountPercentage) return this.priceInFils;
    return Math.round(
        this.priceInFils - (this.priceInFils * this.discountPercentage) / 100,
    );
});

cakeSchema.virtual("estimatedServings").get(function () {
    if (!this.weightInLbs) return 0;
    const BASE = 4;
    return Math.round(this.weightInLbs * BASE);
});

const Cake = mongoose.models.Cake || mongoose.model("Cake", cakeSchema);
export default Cake;
