import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma.js';

/**
 * User Helper Functions
 * These replace the Mongoose schema methods
 */

// Hash password
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Compare password
export const comparePassword = async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
};

// Generate OTP
export const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    return { otp, otpExpire };
};

// Create user with hashed password
export const createUser = async (userData) => {
    const hashedPassword = await hashPassword(userData.password);

    return await prisma.user.create({
        data: {
            ...userData,
            password: hashedPassword,
        },
    });
};

// Find user by email (with password)
export const findUserByEmail = async (email, includePassword = false) => {
    return await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            name: true,
            email: true,
            password: includePassword,
            isVerified: true,
            otp: includePassword,
            otpExpire: includePassword,
            resetPasswordToken: true,
            resetPasswordExpire: true,
            createdAt: true,
            updatedAt: true,
            lastLogin: true,
            analysisCount: true,
        },
    });
};

// Find user by ID
export const findUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id },
    });
};

// Update user
export const updateUser = async (id, data) => {
    // If password is being updated, hash it
    if (data.password) {
        data.password = await hashPassword(data.password);
    }

    return await prisma.user.update({
        where: { id },
        data,
    });
};

// Set OTP for user
export const setUserOTP = async (userId) => {
    const { otp, otpExpire } = generateOTP();

    await prisma.user.update({
        where: { id: userId },
        data: {
            otp,
            otpExpire,
        },
    });

    return otp;
};

// Verify OTP
export const verifyUserOTP = async (userId, enteredOTP) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            otp: true,
            otpExpire: true,
        },
    });

    if (!user || !user.otp || !user.otpExpire) {
        return false;
    }

    if (user.otpExpire < new Date()) {
        return false; // OTP expired
    }

    return user.otp === enteredOTP;
};

// Clear OTP and verify user
export const verifyUser = async (userId) => {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            isVerified: true,
            otp: null,
            otpExpire: null,
        },
    });
};

// Update last login
export const updateLastLogin = async (userId) => {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            lastLogin: new Date(),
        },
    });
};

// Increment analysis count
export const incrementAnalysisCount = async (userId) => {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            analysisCount: {
                increment: 1,
            },
        },
    });
};

export default {
    hashPassword,
    comparePassword,
    generateOTP,
    createUser,
    findUserByEmail,
    findUserById,
    updateUser,
    setUserOTP,
    verifyUserOTP,
    verifyUser,
    updateLastLogin,
    incrementAnalysisCount,
};
