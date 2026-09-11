import { z } from "zod";

const booleanField = z
    .string()
    .optional()
    .transform((val) => val === "true" || val === "1");

const positiveIntegerString = (fieldName) =>
    z
        .string({ error: `${fieldName} is required` })
        .regex(/^\d+$/, `${fieldName} must be a valid integer`)
        .transform(Number);

const nonNegativeIntegerString = (fieldName) =>
    z
        .string({ error: `${fieldName} is required` })
        .regex(/^\d+$/, `${fieldName} must be a valid integer`)
        .transform(Number);

const percentageString = z
    .string()
    .optional()
    .refine(
        (value) =>
            value === undefined ||
            (/^\d+(\.\d+)?$/.test(value) &&
                Number(value) >= 0 &&
                Number(value) <= 100),
        "Discount must be between 0 and 100",
    )
    .transform((value) => (value === undefined ? undefined : Number(value)));

export const createCakeSchema = z.object({
    nameEn: z
        .string({ error: "English name is required" })
        .trim()
        .min(3, "English name must be at least 3 characters")
        .max(150, "English name cannot exceed 150 characters"),

    nameAr: z
        .string({ error: "Arabic name is required" })
        .trim()
        .min(3, "Arabic name must be at least 3 characters")
        .max(150, "Arabic name cannot exceed 150 characters"),

    descriptionEn: z
        .string({ error: "English description is required" })
        .trim()
        .min(10, "English description must be at least 10 characters")
        .max(1000, "English description cannot exceed 1000 characters"),

    descriptionAr: z
        .string({ error: "Arabic description is required" })
        .trim()
        .min(10, "Arabic description must be at least 10 characters")
        .max(1000, "Arabic description cannot exceed 1000 characters"),

    category: z
        .string({ error: "Category is required" })
        .trim()
        .min(1, "Category is required"),

    flavor: z.enum(
        [
            "chocolate",
            "vanilla",
            "red-velvet",
            "strawberry",
            "carrot",
            "butterscotch",
            "black-forest",
            "lemon",
            "mango",
            "pistachio",
        ],
        { error: "Please select a valid cake flavor" },
    ),

    weightSize: z.enum(["small", "medium"], {
        error: "Size must be either small or medium",
    }),

    priceInFils: nonNegativeIntegerString("Price"),

    discountPercentage: percentageString,

    stock: nonNegativeIntegerString("Stock"),

    isCustomAvailable: booleanField,

    isFeatured: booleanField,

    isActive: booleanField,

    tags: z
        .string()
        .optional()
        .transform((value) => {
            if (!value) return undefined;

            return value
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean);
        }),
});

export const updateCakeSchema = z.object({
    nameEn: z
        .string()
        .trim()
        .min(3, "English name must be at least 3 characters")
        .max(150, "English name cannot exceed 150 characters")
        .optional(),

    nameAr: z
        .string()
        .trim()
        .min(3, "Arabic name must be at least 3 characters")
        .max(150, "Arabic name cannot exceed 150 characters")
        .optional(),

    descriptionEn: z
        .string()
        .trim()
        .min(10, "English description must be at least 10 characters")
        .max(1000, "English description cannot exceed 1000 characters")
        .optional(),

    descriptionAr: z
        .string()
        .trim()
        .min(10, "Arabic description must be at least 10 characters")
        .max(1000, "Arabic description cannot exceed 1000 characters")
        .optional(),

    category: z.string().trim().min(1, "Category cannot be empty").optional(),

    flavor: z
        .enum([
            "chocolate",
            "vanilla",
            "red-velvet",
            "strawberry",
            "carrot",
            "butterscotch",
            "black-forest",
            "lemon",
            "mango",
            "pistachio",
        ])
        .optional(),

    weightSize: z.enum(["small", "medium"]).optional(),

    priceInFils: nonNegativeIntegerString("Price").optional(),

    discountPercentage: percentageString,

    stock: nonNegativeIntegerString("Stock").optional(),

    isCustomAvailable: booleanField,

    isFeatured: booleanField,

    isActive: booleanField,

    tags: z
        .string()
        .optional()
        .transform((value) => {
            if (!value) return undefined;

            return value
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean);
        }),
});
