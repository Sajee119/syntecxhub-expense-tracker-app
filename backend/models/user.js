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
    createdAt: {
        type: Date,
        default: Date.now
    },
    expenses: [{
        text: {
            type: String,
            required: true
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