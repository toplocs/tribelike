"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLogout = exports.handleGetSession = void 0;
const models_1 = require("../../models");
const handleGetSession = async (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        let authToken = authHeader;
        if (!authToken) {
            const { token } = await models_1.sessions.createToken({
                userId: '',
            });
            authToken = token;
        }
        const session = await models_1.sessions.validateToken(authToken);
        if (!session) {
            res.status(401).json({ error: 'Unauthorized. Session not valid' });
            return;
        }
        if (!('userId' in session.data)) {
            res.status(401).json({ error: 'Unauthorized. User not Found' });
            return;
        }
        const loggedIn = session.data.userId != '';
        res.status(200).json(session);
    }
    catch (e) {
        console.error(e);
        res.status(400).json(e.error);
    }
};
exports.handleGetSession = handleGetSession;
const handleLogout = async (req, res) => {
    try {
        // Todo: Invalidate the session token
    }
    catch (error) {
        res.status(500).send({ message: 'Logout failed', error });
    }
};
exports.handleLogout = handleLogout;
