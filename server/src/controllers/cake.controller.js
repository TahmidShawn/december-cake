import Cake from "../models/cake.model.js";
import Category from "../models/category.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadFile, deleteFile } from "../services/storage.service.js";

const uploadCakeImages = async (files) => {
    const images = [];

    try {
        for (const file of files) {
            const { url, fileId } = await uploadFile(
                file.buffer,
                file.originalname,
                "cakes",
            );

            images.push({
                url,
                fileId,
            });
        }

        return images;
    } catch (error) {
        await Promise.allSettled(
            images.map((image) => deleteFile(image.fileId)),
        );

        throw error;
    }
};

const deleteCakeImages = async (images) => {
    if (!images?.length) return;

    await Promise.allSettled(
        images
            .filter((image) => image.fileId)
            .map((image) => deleteFile(image.fileId)),
    );
};

export const createCake = asyncHandler(async (req, res) => {
    const {
        nameEn,
        nameAr,
        descriptionEn,
        descriptionAr,
        category,
        flavor,
        weightSize,
        price,
        discountPercentage,
        stock,
        isCustomAvailable,
        isFeatured,
        isActive,
        tags,
    } = req.body;

    const files = req.files;

    if (!files?.length) {
        throw new ErrorHandler("At least one cake image is required", 400);
    }

    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
        throw new ErrorHandler("Category not found", 404);
    }

    const existingCake = await Cake.findOne({
        $or: [{ "name.en": nameEn }, { "name.ar": nameAr }],
    });

    if (existingCake) {
        throw new ErrorHandler("Cake with this name already exists", 409);
    }

    const images = await uploadCakeImages(files);

    try {
        const cake = await Cake.create({
            name: {
                en: nameEn,
                ar: nameAr,
            },
            description: {
                en: descriptionEn,
                ar: descriptionAr,
            },
            images,
            category,
            flavor,
            weightSize,
            price,
            discountPercentage,
            stock,
            isCustomAvailable,
            isFeatured,
            isActive,
            tags,
            createdBy: req.user?._id,
        });

        await cake.populate("category", "name slug");

        res.status(201).json({
            success: true,
            message: "Cake created successfully",
            data: cake,
        });
    } catch (error) {
        await deleteCakeImages(images);
        throw error;
    }
});

export const getCakes = asyncHandler(async (req, res) => {
    const { category, price, size, sort = "featured" } = req.query;

    const filter = {
        isActive: true,
    };

    // Category filter
    if (category) {
        const existingCategory = await Category.findOne({
            slug: category,
            isActive: true,
        }).select("_id");

        if (!existingCategory) {
            throw new ErrorHandler("Category not found", 404);
        }

        filter.category = existingCategory._id;
    }

    // Price filter
    if (price) {
        const [min, max] = price.split("-").map(Number);

        if (Number.isNaN(min) || Number.isNaN(max) || min < 0 || max < min) {
            throw new ErrorHandler("Invalid price range", 400);
        }

        filter.discountedPrice = {
            $gte: min,
            $lte: max,
        };
    }

    // Size filter
    if (size) {
        const sizes = size
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

        const allowedSizes = ["small", "medium"];

        const hasInvalidSize = sizes.some(
            (item) => !allowedSizes.includes(item),
        );

        if (hasInvalidSize) {
            throw new ErrorHandler("Invalid size", 400);
        }

        if (sizes.length > 0) {
            filter.weightSize = {
                $in: sizes,
            };
        }
    }

    // Sorting
    let sortOption = {
        createdAt: -1,
    };

    if (sort === "price-low") {
        sortOption = {
            discountedPrice: 1,
        };
    }

    if (sort === "price-high") {
        sortOption = {
            discountedPrice: -1,
        };
    }

    if (sort === "name") {
        sortOption = {
            "name.en": 1,
        };
    }

    const cakes = await Cake.find(filter)
        .populate("category", "name slug")
        .sort(sortOption);

    res.status(200).json({
        success: true,
        message: "Cakes fetched successfully",
        data: cakes,
    });
});

export const getCake = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const cake = await Cake.findById(id).populate("category", "name slug");

    if (!cake) {
        throw new ErrorHandler("Cake not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Cake fetched successfully",
        data: cake,
    });
});

export const updateCake = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const {
        nameEn,
        nameAr,
        descriptionEn,
        descriptionAr,
        category,
        flavor,
        weightSize,
        price,
        discountPercentage,
        stock,
        isCustomAvailable,
        isFeatured,
        isActive,
        tags,
    } = req.body;

    const cake = await Cake.findById(id);

    if (!cake) {
        throw new ErrorHandler("Cake not found", 404);
    }

    if (category !== undefined) {
        const existingCategory = await Category.findById(category);

        if (!existingCategory) {
            throw new ErrorHandler("Category not found", 404);
        }
    }

    if (nameEn !== undefined || nameAr !== undefined) {
        const duplicateConditions = [];

        if (nameEn !== undefined) {
            duplicateConditions.push({
                "name.en": nameEn,
            });
        }

        if (nameAr !== undefined) {
            duplicateConditions.push({
                "name.ar": nameAr,
            });
        }

        const duplicate = await Cake.findOne({
            _id: { $ne: id },
            $or: duplicateConditions,
        });

        if (duplicate) {
            throw new ErrorHandler("Cake with this name already exists", 409);
        }
    }

    const updateData = {};

    if (nameEn !== undefined) {
        updateData["name.en"] = nameEn;
    }

    if (nameAr !== undefined) {
        updateData["name.ar"] = nameAr;
    }

    if (descriptionEn !== undefined) {
        updateData["description.en"] = descriptionEn;
    }

    if (descriptionAr !== undefined) {
        updateData["description.ar"] = descriptionAr;
    }

    if (category !== undefined) {
        updateData.category = category;
    }

    if (flavor !== undefined) {
        updateData.flavor = flavor;
    }

    if (weightSize !== undefined) {
        updateData.weightSize = weightSize;
    }

    if (price !== undefined) {
        updateData.price = price;
    }

    if (discountPercentage !== undefined) {
        updateData.discountPercentage = discountPercentage;
    }

    if (stock !== undefined) {
        updateData.stock = stock;
    }

    if (isCustomAvailable !== undefined) {
        updateData.isCustomAvailable = isCustomAvailable;
    }

    if (isFeatured !== undefined) {
        updateData.isFeatured = isFeatured;
    }

    if (isActive !== undefined) {
        updateData.isActive = isActive;
    }

    if (tags !== undefined) {
        updateData.tags = tags;
    }

    let newImages;

    if (req.files?.length) {
        newImages = await uploadCakeImages(req.files);
        updateData.images = newImages;
    }

    try {
        const updatedCake = await Cake.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).populate("category", "name slug");

        if (!updatedCake) {
            if (newImages) {
                await deleteCakeImages(newImages);
            }

            throw new ErrorHandler("Cake not found", 404);
        }

        if (newImages) {
            await deleteCakeImages(cake.images);
        }

        res.status(200).json({
            success: true,
            message: "Cake updated successfully",
            data: updatedCake,
        });
    } catch (error) {
        if (newImages) {
            await deleteCakeImages(newImages);
        }

        throw error;
    }
});

export const deleteCake = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const cake = await Cake.findById(id);

    if (!cake) {
        throw new ErrorHandler("Cake not found", 404);
    }

    await deleteCakeImages(cake.images);

    await cake.deleteOne();

    res.status(200).json({
        success: true,
        message: "Cake deleted successfully",
    });
});

export const getAdminCakes = asyncHandler(async (req, res) => {
    const {
        search,
        category,
        isActive,
        isFeatured,
        sort = "newest",
        page = 1,
        limit = 20,
    } = req.query;

    const filter = {};

    if (search) {
        filter.$or = [
            { "name.en": { $regex: search, $options: "i" } },
            { "name.ar": { $regex: search, $options: "i" } },
        ];
    }

    if (category) {
        const existingCategory = await Category.findOne({
            slug: category,
        }).select("_id");

        if (!existingCategory) {
            throw new ErrorHandler("Category not found", 404);
        }

        filter.category = existingCategory._id;
    }

    if (isActive !== undefined) {
        filter.isActive = isActive === "true";
    }

    if (isFeatured !== undefined) {
        filter.isFeatured = isFeatured === "true";
    }

    let sortOption = { createdAt: -1 };

    if (sort === "oldest") {
        sortOption = { createdAt: 1 };
    }

    if (sort === "price-low") {
        sortOption = { discountedPrice: 1 };
    }

    if (sort === "price-high") {
        sortOption = { discountedPrice: -1 };
    }

    if (sort === "name") {
        sortOption = { "name.en": 1 };
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const [cakes, total] = await Promise.all([
        Cake.find(filter)
            .populate("category", "name slug")
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum),
        Cake.countDocuments(filter),
    ]);

    res.status(200).json({
        success: true,
        message: "Admin cakes fetched successfully",
        data: cakes,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            pages: Math.ceil(total / limitNum),
        },
    });
});
