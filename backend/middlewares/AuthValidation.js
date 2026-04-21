import Joi from 'joi';

const SUPPORTED_CURRENCIES = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
];
const SUPPORTED_CURRENCY_CODES = SUPPORTED_CURRENCIES.map((currency) => currency.code);
const SUPPORTED_THEMES = ['light', 'dark'];

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        currency: Joi.string().valid(...SUPPORTED_CURRENCY_CODES).default('USD'),
        theme: Joi.string().valid(...SUPPORTED_THEMES).default('light')
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ status: 'error', message: error.details[0].message });
    }

    req.body = value;

    next();
};

const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ status: 'error', message: error.details[0].message });
    }

    next();
};

const updateUserValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        currency: Joi.string().valid(...SUPPORTED_CURRENCY_CODES).required(),
        theme: Joi.string().valid(...SUPPORTED_THEMES).optional()
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ status: 'error', message: error.details[0].message });
    }

    req.body = value;

    next();
};

const changePasswordValidation = (req, res, next) => {
    const schema = Joi.object({
        currentPassword: Joi.string().min(6).required(),
        newPassword: Joi.string().min(6).required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ status: 'error', message: error.details[0].message });
    }

    next();
};

const updateThemeValidation = (req, res, next) => {
    const schema = Joi.object({
        theme: Joi.string().valid(...SUPPORTED_THEMES).required()
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ status: 'error', message: error.details[0].message });
    }

    req.body = value;

    next();
};

export {
    signupValidation,
    loginValidation,
    updateUserValidation,
    changePasswordValidation,
    updateThemeValidation,
    SUPPORTED_CURRENCIES,
    SUPPORTED_CURRENCY_CODES,
    SUPPORTED_THEMES
};