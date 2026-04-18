import express from 'express';
import { getExpenses, addExpenses, updateExpense, deleteExpense } from '../controllers/ExpenseController.js';
import { ensureAuthenticated } from '../middlewares/Auth.js';

const router = express.Router();

router.get('/', ensureAuthenticated, getExpenses);
router.post('/', ensureAuthenticated, addExpenses);
router.put('/:id', ensureAuthenticated, updateExpense);
router.delete('/:id', ensureAuthenticated, deleteExpense);


export default router;