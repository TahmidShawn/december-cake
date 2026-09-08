import crypto from "crypto";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import sendToken from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";
import { cookieOptions } from "../utils/sendToken.js";

const clearAuthCookies = (res) => {
    const clearOpts = {
        ...cookieOptions(0),
        expires: new Date(0),
    };
    res.cookie("token", null, clearOpts);
    res.cookie("refreshToken", null, clearOpts);
};

export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        if (existingUser.isVerified) {
            throw new ErrorHandler(
                "An account with this email already exists. Please log in.",
                409,
            );
        }

        existingUser.username = username;
        existingUser.password = password;

        const plainCode = existingUser.getVerificationCode();
        await existingUser.save({ validateBeforeSave: false });

        const message = `
            Hello ${existingUser.username},

            Thank you for registering! Please verify your email using the code below:

            ${plainCode}

            This code expires in 10 minutes.

            If you did not request this, please ignore this email.

            Regards,
            The Cake Shop Team
        `;

        await sendEmail({
            email: existingUser.email,
            subject: "Email Verification Code - Cake Shop",
            message,
        });

        return res.status(200).json({
            success: true,
            message: `A new verification code has been sent to ${existingUser.email}. Please verify to complete registration.`,
        });
    }

    const user = await User.create({ username, email, password });
    const plainCode = user.getVerificationCode();
    await user.save({ validateBeforeSave: false });

    const message = `
        Hello ${user.username},

        Thank you for registering! Please verify your email using the code below:

        ${plainCode}

        This code expires in 10 minutes.

        If you did not request this, please ignore this email.

        Regards,
        The Cake Shop Team
    `;

    await sendEmail({
        email: user.email,
        subject: "Email Verification Code - Cake Shop",
        message,
    });

    res.status(201).json({
        success: true,
        message: `A verification code has been sent to ${user.email}.`,
        ...(process.env.NODE_ENV === "development" && { devCode: plainCode }),
    });
});

export const verifyEmail = asyncHandler(async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        throw new ErrorHandler("Email and verification code are required", 400);
    }

    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

    const user = await User.findOne({
        email,
        verifyCode: hashedCode,
        verifyCodeExpiry: { $gt: Date.now() },
    }).select("+verifyCode +verifyCodeExpiry");

    if (!user) {
        throw new ErrorHandler(
            "Invalid or expired verification code. Please request a new one.",
            400,
        );
    }

    user.isVerified = true;
    user.verifyCode = undefined;
    user.verifyCodeExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    await sendToken(
        user,
        200,
        res,
        "Email verified successfully. You are now logged in.",
    );
});

export const resendVerification = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.isVerified) {
        return res.status(200).json({
            success: true,
            message:
                "A new verification code has been sent to your email. Please check your inbox and spam folder.",
        });
    }

    const plainCode = user.getVerificationCode();
    await user.save({ validateBeforeSave: false });

    const message = `
        Hello ${user.username},

        Please verify your email using the code below:

        ${plainCode}

        This code expires in 10 minutes.

        If you did not request this, please ignore this email.
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: "New Verification Code - Cake Shop",
            message,
        });
    } catch (error) {
        // ignore
    }

    res.status(200).json({
        success: true,
        message:
            "A new verification code has been sent to your email. Please check your inbox and spam folder.",
    });
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
        throw new ErrorHandler("Invalid email or password", 401);
    }

    if (!user.isVerified) {
        throw new ErrorHandler(
            "Please verify your email before logging in. Use the verification code sent to your email.",
            403,
        );
    }

    await sendToken(user, 200, res, "Login successful");
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ErrorHandler(
            "No refresh token provided, please login again",
            401,
        );
    }

    let decoded;
    try {
        decoded = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        );
    } catch {
        throw new ErrorHandler(
            "Refresh token is invalid or has expired, please login again",
            401,
        );
    }

    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user || user.refreshToken !== incomingRefreshToken) {
        throw new ErrorHandler(
            "Refresh token is invalid or has expired, please login again",
            401,
        );
    }

    await sendToken(user, 200, res, "Access token refreshed");
});

export const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
    clearAuthCookies(res);
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});

export const forgotPassword = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(200).json({
            success: true,
            message:
                "If an account exists with this email, password reset instructions have been sent.",
        });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.CLIENT_URL}/password/reset/${resetToken}`;

    const message = `
        Hello ${user.username},

        We received a request to reset your password. Click the link below:

        ${resetPasswordUrl}

        This link expires in 15 minutes. If you did not request this, please ignore this email.

        The Cake Shop Team
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: "Password Reset Request - Action Required",
            message,
        });
        res.status(200).json({
            success: true,
            message: `An email with password reset instructions has been sent to ${user.email}.`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        throw new ErrorHandler(
            "Failed to send password reset email. Please try again later.",
            500,
        );
    }
});

export const resetPassword = asyncHandler(async (req, res) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpire");

    if (!user) {
        throw new ErrorHandler(
            "Reset password token is invalid or has expired",
            400,
        );
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    await sendToken(
        user,
        200,
        res,
        "Password reset successful. You are now logged in.",
    );
});
