import User from '../models/user.js';

const getBudget = async (req, res) => {
    const userId = req.user.userId;
    try {
        const userData = await User.findById(userId).select('monthlyBudget');
        if (!userData) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        return res.json({ 
            status: 'success', 
            monthlyBudget: userData.monthlyBudget || 0 
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

const updateBudget = async (req, res) => {
    const userId = req.user.userId;
    const { monthlyBudget } = req.body;

    if (monthlyBudget === undefined || monthlyBudget === null) {
        return res.status(400).json({ status: 'error', message: 'Monthly budget is required' });
    }

    const budget = Number(monthlyBudget);

    if (!Number.isFinite(budget) || budget < 0) {
        return res.status(400).json({ status: 'error', message: 'Enter a valid monthly budget amount' });
    }

    try {
        const userData = await User.findByIdAndUpdate(
            userId,
            { monthlyBudget: budget },
            { new: true }
        ).select('monthlyBudget');

        if (!userData) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        return res.json({ 
            status: 'success', 
            message: 'Monthly budget updated successfully',
            monthlyBudget: userData.monthlyBudget 
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

export { getBudget, updateBudget };
