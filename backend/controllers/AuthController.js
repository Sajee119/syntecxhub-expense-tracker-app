import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { SUPPORTED_CURRENCIES, SUPPORTED_CURRENCY_CODES, SUPPORTED_THEMES } from '../middlewares/AuthValidation.js';

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;
const passwordResetTokens = new Map();

const createResetToken = () => Math.random().toString(36).slice(2, 8).toUpperCase();

const signup = async (req, res) => {
    try {
        const { name, email, password, currency, theme } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            return res.status(403).json({ status: 'error', message: 'Email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userModel = new User({
            name,
            email,
            password: hashedPassword,
            currency: currency || 'USD',
            theme: theme || 'light'
        });
        await userModel.save();

        res.status(201).json({ status: 'success', message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
        console.error('Server error:', error);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ status: 'error', message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ status: 'error', message: 'Invalid email or password' });
        }

        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign({ email: user.email, userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
            status: 'success',
            token,
            user: {
                name: user.name,
                email: user.email,
                currency: user.currency || 'USD',
                theme: user.theme || 'light'
            }
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
        console.error('Server error:', error);
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('name email createdAt lastLogin currency theme');

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        return res.json({
            status: 'success',
            username: user.name,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
            currency: user.currency || 'USD',
            theme: user.theme || 'light',
            supportedCurrencies: SUPPORTED_CURRENCIES,
            supportedCurrencyCodes: SUPPORTED_CURRENCY_CODES,
            supportedThemes: SUPPORTED_THEMES
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

const updateCurrentUser = async (req, res) => {
    try {
        const { name, email, currency, theme } = req.body;
        const userId = req.user.userId;

        const existingUser = await User.findOne({ email, _id: { $ne: userId } });

        if (existingUser) {
            return res.status(409).json({ status: 'error', message: 'Email already exists.' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { name, email, currency, ...(theme ? { theme } : {}) },
            { new: true, runValidators: true }
        ).select('name email currency theme');

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        return res.json({
            status: 'success',
            message: 'Account details updated successfully',
            user: {
                name: user.name,
                email: user.email,
                currency: user.currency || 'USD',
                theme: user.theme || 'light'
            }
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ status: 'error', message: 'Current password is incorrect' });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({ status: 'error', message: 'New password must be different from current password' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.json({ status: 'success', message: 'Password changed successfully' });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

const updateTheme = async (req, res) => {
    try {
        const { theme } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { theme },
            { new: true, runValidators: true }
        ).select('name email currency theme');

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        return res.json({
            status: 'success',
            message: 'Theme updated successfully',
            user: {
                name: user.name,
                email: user.email,
                currency: user.currency || 'USD',
                theme: user.theme || 'light'
            }
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
};


export { signup, login, getCurrentUser, updateCurrentUser, changePassword, updateTheme };