import express from 'express';
import { getSpendingGoals, addSpendingGoal, deleteSpendingGoal, updateCategoryBudget } from '../controllers/GoalsController.js';
import { ensureAuthenticated } from '../middlewares/Auth.js';

const router = express.Router();

router.get('/', ensureAuthenticated, getSpendingGoals);
router.post('/', ensureAuthenticated, addSpendingGoal);
router.delete('/', ensureAuthenticated, deleteSpendingGoal);
router.put('/category-budget', ensureAuthenticated, updateCategoryBudget);

export default router;
