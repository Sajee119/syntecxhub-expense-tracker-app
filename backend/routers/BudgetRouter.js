import express from 'express';
import { getBudget, updateBudget } from '../controllers/BudgetController.js';
import { ensureAuthenticated } from '../middlewares/Auth.js';

const router = express.Router();

router.get('/', ensureAuthenticated, getBudget);
router.put('/', ensureAuthenticated, updateBudget);

export default router;
