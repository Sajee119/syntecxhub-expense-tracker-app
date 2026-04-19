import Joi from 'joi';

const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'INR', 'LKR', 'GBP', 'AUD', 'CAD', 'JPY', 'AED'];

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        currency: Joi.string().valid(...SUPPORTED_CURRENCIES).default('USD')
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
        currency: Joi.string().valid(...SUPPORTED_CURRENCIES).required()
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

export { signupValidation, loginValidation, updateUserValidation, changePasswordValidation, SUPPORTED_CURRENCIES };