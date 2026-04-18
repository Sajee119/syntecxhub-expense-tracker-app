import express from 'express';
import { signup, login, getCurrentUser } from '../controllers/AuthController.js';
import { signupValidation, loginValidation } from '../middlewares/AuthValidation.js';
import { ensureAuthenticated } from '../middlewares/Auth.js';

const router = express.Router();

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.get('/me', ensureAuthenticated, getCurrentUser);

export default router;