"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
class UserController {
    static async GetUsers(req, res) {
        try {
            res.status(403).json({ error: 'Forbidden' });
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: e.message });
        }
    }
    static async GetUser(req, res) {
        try {
            const { userId } = req.session;
            let user = await models_1.users.getById(userId, { include: { profiles: true } });
            if (user)
                res.status(200).json(user);
            else
                res.status(404).json({ error: 'User not found' });
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: e.message });
        }
    }
    static async UpdateUser(req, res) {
        const formData = req.body;
        try {
            const { userId } = req.session;
            const result = await models_1.users.update(userId, {
                image: formData.image || '/images/default.jpeg',
                emailVerified: formData.emailVerified,
            });
            if (result)
                res.status(200).json(result);
            else
                res.status(404).json({ error: 'User not found' });
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: e.message });
        }
    }
    // TODO: Cascading delete   
    static async DeleteUser(req, res) {
        try {
            const { userId } = req.session;
            const result = await models_1.users.delete(userId);
            if (result)
                res.status(200).json({ success: 'User deleted' });
            else
                res.status(404).json({ error: 'User not found' });
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: e.message });
        }
    }
}
exports.default = UserController;
