import ErrorHandler from "../utils/errorHandler.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import sendToken from "../utils/sendToken.js";

export const getMe = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "User found",
        data: req.user,
    });
});

export const updatePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("+password");

    const isPasswordMatched = await user.comparePassword(
        req.body.currentPassword,
    );
    if (!isPasswordMatched) {
        throw new ErrorHandler("Current password is incorrect", 401);
    }

    user.password = req.body.newPassword;
    await user.save();

    await sendToken(user, 200, res, "Password updated successfully");
});
