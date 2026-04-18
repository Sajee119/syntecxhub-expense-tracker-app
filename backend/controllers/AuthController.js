import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;
const passwordResetTokens = new Map();

const createResetToken = () => Math.random().toString(36).slice(2, 8).toUpperCase();

const signup = async (req, res) => {
    try {
        const { name, email, password, currency } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            return res.status(403).json({ status: 'error', message: 'Email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userModel = new User({ name, email, password: hashedPassword, currency: currency || 'USD' });
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
                currency: user.currency || 'USD'
            }
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
        console.error('Server error:', error);
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('name email createdAt lastLogin currency');

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
            currency: user.currency || 'USD'
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
};


export { signup, login, getCurrentUser };