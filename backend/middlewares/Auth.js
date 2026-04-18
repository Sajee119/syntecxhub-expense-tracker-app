import jwt from 'jsonwebtoken';

const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({ status: 'error', message: 'Unauthorized, JWT token is required.' });
    }

    try {
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ status: 'error', message: 'Invalid token' });
    }
};

export { ensureAuthenticated };