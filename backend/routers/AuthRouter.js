import express from 'express';
import { signup, login, getCurrentUser, updateCurrentUser, changePassword } from '../controllers/AuthController.js';
import { signupValidation, loginValidation, updateUserValidation, changePasswordValidation } from '../middlewares/AuthValidation.js';
import { ensureAuthenticated } from '../middlewares/Auth.js';

const router = express.Router();

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.get('/me', ensureAuthenticated, getCurrentUser);
router.put('/me', ensureAuthenticated, updateUserValidation, updateCurrentUser);
router.post('/change-password', ensureAuthenticated, changePasswordValidation, changePassword);

export default router;