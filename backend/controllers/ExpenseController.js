
import User from '../models/user.js';

const EXPENSE_CATEGORIES = ['General', 'Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Education', 'Travel', 'Other'];


const addExpenses = async (req, res) => {
    const { amount, description, date, category } = req.body;
    const userId = req.user.userId;

    if (!amount || !description || !date) {
        return res.status(400).json({ status: 'error', message: 'All fields are required' });
    }

    const safeCategory = EXPENSE_CATEGORIES.includes(category) ? category : 'General';

    try {
        await User.findByIdAndUpdate(
            userId, 
            { 
                $push: { 
                    expenses: { 
                        text: description, 
                        category: safeCategory,
                        amount, 
                        createdAt: date 
                    } 
                } 
            },
            { new: true }
        );
        return res.status(201).json({ status: 'success', message: 'Expense added successfully' });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

const getExpenses = async (req, res) => {
    const userId = req.user.userId;
    try {
        const userData = await User.findById(userId).select('expenses');
        if (!userData) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        return res.json({ status: 'success', expenses: userData.expenses });
    } catch (error) {

        console.error('Server error:', error);
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

const updateExpense = async (req, res) => {

    const { id: expenseId } = req.params;
    const { amount, description, date, category } = req.body;
    const userId = req.user.userId;
    try {
        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        const expenseIndex = userData.expenses.findIndex(exp => exp._id.toString() === expenseId);

        if (expenseIndex === -1) {
            return res.status(404).json({ status: 'error', message: 'Expense not found' });
        }

        userData.expenses[expenseIndex].text = description;
    userData.expenses[expenseIndex].category = EXPENSE_CATEGORIES.includes(category) ? category : 'General';
        userData.expenses[expenseIndex].amount = amount;
        userData.expenses[expenseIndex].createdAt = date;
        await userData.save();

        return res.json({ status: 'success', message: 'Expense updated successfully' });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

const deleteExpense = async (req, res) => {
    const { id: expenseId } = req.params;
    const userId = req.user.userId;

    try {
        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        const expense = userData.expenses.id(expenseId);

        if (!expense) {
            return res.status(404).json({ status: 'error', message: 'Expense not found' });
        }

        expense.deleteOne();
        await userData.save();

        return res.json({ status: 'success', message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

export { addExpenses, getExpenses, updateExpense, deleteExpense };