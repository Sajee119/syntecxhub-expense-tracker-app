import User from '../models/user.js';

const EXPENSE_CATEGORIES = ['General', 'Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Education', 'Travel', 'Other'];

const getSpendingGoals = async (req, res) => {
    const userId = req.user.userId;
    try {
        const userData = await User.findById(userId).select('spendingGoals categoryBudgets');
        if (!userData) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        return res.json({ 
            status: 'success', 
            spendingGoals: userData.spendingGoals || [],
            categoryBudgets: userData.categoryBudgets || []
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

const addSpendingGoal = async (req, res) => {
    const userId = req.user.userId;
    const { category, limit } = req.body;

    if (!category || !limit) {
        return res.status(400).json({ status: 'error', message: 'Category and limit are required' });
    }

    if (!EXPENSE_CATEGORIES.includes(category)) {
        return res.status(400).json({ status: 'error', message: 'Invalid category' });
    }

    const limitNum = Number(limit);
    if (!Number.isFinite(limitNum) || limitNum <= 0) {
        return res.status(400).json({ status: 'error', message: 'Enter a valid limit amount' });
    }

    try {
        // Remove existing goal for this category
        await User.findByIdAndUpdate(
            userId,
            { $pull: { spendingGoals: { category } } }
        );

        // Add new goal
        const userData = await User.findByIdAndUpdate(
            userId,
            { $push: { spendingGoals: { category, limit: limitNum } } },
            { new: true }
        ).select('spendingGoals');

        return res.json({ 
            status: 'success', 
            message: 'Spending goal added successfully',
            spendingGoals: userData.spendingGoals
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

const deleteSpendingGoal = async (req, res) => {
    const userId = req.user.userId;
    const { category } = req.body;

    if (!category) {
        return res.status(400).json({ status: 'error', message: 'Category is required' });
    }

    try {
        const userData = await User.findByIdAndUpdate(
            userId,
            { $pull: { spendingGoals: { category } } },
            { new: true }
        ).select('spendingGoals');

        return res.json({ 
            status: 'success', 
            message: 'Spending goal deleted successfully',
            spendingGoals: userData.spendingGoals
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

const updateCategoryBudget = async (req, res) => {
    const userId = req.user.userId;
    const { category, budget } = req.body;

    if (!category || budget === undefined) {
        return res.status(400).json({ status: 'error', message: 'Category and budget are required' });
    }

    if (!EXPENSE_CATEGORIES.includes(category)) {
        return res.status(400).json({ status: 'error', message: 'Invalid category' });
    }

    const budgetNum = Number(budget);
    if (!Number.isFinite(budgetNum) || budgetNum < 0) {
        return res.status(400).json({ status: 'error', message: 'Enter a valid budget amount' });
    }

    try {
        // Remove existing budget for this category
        await User.findByIdAndUpdate(
            userId,
            { $pull: { categoryBudgets: { category } } }
        );

        // Add new budget if amount > 0
        let userData;
        if (budgetNum > 0) {
            userData = await User.findByIdAndUpdate(
                userId,
                { $push: { categoryBudgets: { category, budget: budgetNum } } },
                { new: true }
            ).select('categoryBudgets');
        } else {
            userData = await User.findById(userId).select('categoryBudgets');
        }

        return res.json({ 
            status: 'success', 
            message: 'Category budget updated successfully',
            categoryBudgets: userData.categoryBudgets
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

export { getSpendingGoals, addSpendingGoal, deleteSpendingGoal, updateCategoryBudget };
