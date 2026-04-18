import Joi from 'joi';

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ status: 'error', message: error.details[0].message });
    }

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

export { signupValidation, loginValidation };