"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const authenticate = async (req, res, next) => {
    if (req.method === "OPTIONS") {
        next();
    }
    if (!req.session.loggedIn) {
        res.status(401).json({ error: 'Unauthorized. User not logged in' });
        return;
    }
    next();
};
exports.authenticate = authenticate;
