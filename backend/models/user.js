import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'INR', 'LKR', 'GBP', 'AUD', 'CAD', 'JPY', 'AED'],
        default: 'USD'
    },
    theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light'
    },
    monthlyBudget: {
        type: Number,
        default: 0
    },
    spendingGoals: [{
        category: {
            type: String,
            enum: ['General', 'Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Education', 'Travel', 'Other'],
            required: true
        },
        limit: {
            type: Number,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    categoryBudgets: [{
        category: {
            type: String,
            enum: ['General', 'Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Education', 'Travel', 'Other'],
            required: true
        },
        budget: {
            type: Number,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    expenses: [{
        text: {
            type: String,
            required: true
        },
        category: {
            type: String,
            enum: ['General', 'Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Education', 'Travel', 'Other'],
            default: 'General'
        },
        amount: {
            type: Number,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
});

const User = mongoose.model('User', userSchema);

export default User;