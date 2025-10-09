import jwt from 'jsonwebtoken';
import User from '../Models/userModel.js';
import asyncHandler from './asyncHandler.js';

const authenticator = asyncHandler(async (req, res, next) => {
    const token = req.cookies.jwt;  // read cookie
    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password");
        next();
    } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
    }
});

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {   // fixed camelCase
        next();
    } else {
        res.status(401);
        throw new Error("Not authorized as an admin");
    }
};

export { authenticator, admin };
