"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMiddleware = void 0;
const sessionMiddleware = async (req, res, next) => {
    try {
        /*if (req.method === "OPTIONS") {
            next();
        }
        if (req.path === '/api/auth/session') return next();
        if (req.path === '/api/session') return next();
        if (req.path.startsWith('/api/auth/magicLink')) return next();

        const token = req.get('Authorization');
        if (!token) {
            res.status(401).json({ error: 'Unauthorized. Authorization Header not found' });
            return;
        }

        const validatedSession = await sessions.validateToken(token);
        if (!validatedSession) {
            res.status(401).json({ error: 'Unauthorized. Session not valid' });
            return;
        }

        if (!('userId' in validatedSession.data)) {
            res.status(401).json({ error: 'Unauthorized. User not Found' });
            return;
        }

        const loggedIn = validatedSession.data.userId != '';

        req.session = {
            userId: validatedSession.data.userId,
            loggedIn: loggedIn,
            token: token,
            expires: validatedSession.expires
        };*/
        next();
    }
    catch (err) {
        res.status(500).json({ error: 'Server Error', details: err });
        return;
    }
};
exports.sessionMiddleware = sessionMiddleware;
