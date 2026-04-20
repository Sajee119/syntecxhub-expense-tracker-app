import express from 'express';
import { signup, login, getCurrentUser, updateCurrentUser, changePassword, updateTheme } from '../controllers/AuthController.js';
import { signupValidation, loginValidation, updateUserValidation, changePasswordValidation, updateThemeValidation } from '../middlewares/AuthValidation.js';
import { ensureAuthenticated } from '../middlewares/Auth.js';

const router = express.Router();

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.get('/me', ensureAuthenticated, getCurrentUser);
router.put('/me', ensureAuthenticated, updateUserValidation, updateCurrentUser);
router.post('/change-password', ensureAuthenticated, changePasswordValidation, changePassword);
router.put('/theme', ensureAuthenticated, updateThemeValidation, updateTheme);

export default router;