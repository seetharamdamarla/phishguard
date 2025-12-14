import prisma from '../utils/prisma.js';
import {
    createUser,
    findUserByEmail,
    findUserById,
    comparePassword,
    setUserOTP,
    verifyUserOTP,
    verifyUser,
    updateLastLogin,
} from '../utils/userHelpers.js';
import emailService from '../services/emailService.js';
import { generateToken } from '../middleware/auth.js';

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Check if user already exists
        const userExists = await findUserByEmail(email.toLowerCase());

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create user
        const user = await createUser({
            name,
            email: email.toLowerCase(),
            password
        });

        // Generate and set OTP
        const otp = await setUserOTP(user.id);

        // Send OTP email
        try {
            await emailService.sendOTP(user.email, user.name, otp);
        } catch (emailError) {
            console.error('Failed to send OTP email:', emailError);
            // Continue anyway - user is created
        }

        res.status(201).json({
            success: true,
            message: 'Registration successful. Please check your email for OTP verification.',
            data: {
                userId: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

/**
 * @desc    Verify OTP
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and OTP'
            });
        }

        // Find user
        const user = await findUserByEmail(email.toLowerCase(), true);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify OTP
        const isValidOTP = await verifyUserOTP(user.id, otp);

        if (!isValidOTP) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Mark user as verified
        const verifiedUser = await verifyUser(user.id);

        // Send welcome email
        try {
            await emailService.sendWelcomeEmail(verifiedUser.email, verifiedUser.name);
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
        }

        // Generate token
        const token = generateToken(verifiedUser.id);

        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            data: {
                token,
                user: {
                    id: verifiedUser.id,
                    name: verifiedUser.name,
                    email: verifiedUser.email,
                    isVerified: verifiedUser.isVerified
                }
            }
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during OTP verification'
        });
    }
};

/**
 * @desc    Resend OTP
 * @route   POST /api/auth/resend-otp
 * @access  Public
 */
export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email'
            });
        }

        const user = await findUserByEmail(email.toLowerCase());

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'User is already verified'
            });
        }

        // Generate new OTP
        const otp = await setUserOTP(user.id);

        // Send OTP email
        await emailService.sendOTP(user.email, user.name, otp);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while resending OTP'
        });
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check for user (include password)
        const user = await findUserByEmail(email.toLowerCase(), true);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if verified
        if (!user.isVerified) {
            // Generate and send new OTP
            const otp = await setUserOTP(user.id);

            try {
                await emailService.sendOTP(user.email, user.name, otp);
            } catch (emailError) {
                console.error('Failed to send OTP:', emailError);
            }

            return res.status(403).json({
                success: false,
                message: 'Please verify your email. A new OTP has been sent.',
                requiresVerification: true,
                email: user.email
            });
        }

        // Update last login
        await updateLastLogin(user.id);

        // Generate token
        const token = generateToken(user.id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    isVerified: user.isVerified,
                    analysisCount: user.analysisCount
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
    try {
        const user = await findUserById(req.user.id);

        res.status(200).json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
                analysisCount: user.analysisCount,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};

