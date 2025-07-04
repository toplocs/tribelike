"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
class ProfileController {
    static async GetAllProfiles(req, res) {
        try {
            const allProfiles = await models_1.profiles.getAll();
            res.status(200).json(allProfiles);
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: e.message });
        }
    }
    static async GetAllProfilesForUser(req, res) {
        try {
            const { userId } = req.session;
            const userProfiles = await models_1.profiles.getAllByUserId(userId);
            res.status(200).json(userProfiles);
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: e.message });
        }
    }
    static async GetProfileById(req, res) {
        try {
            const profileId = req.params.id;
            const profile = await models_1.profiles.getById(profileId);
            if (profile)
                res.status(200).json(profile);
            else
                res.status(404).json({ error: 'Profile not found' });
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: e.message });
        }
    }
    static async CreateProfile(req, res) {
        const formData = req.body;
        try {
            const { userId } = req.session;
            const result = await models_1.profiles.create({
                ...formData,
                userId
            });
            if (result)
                res.status(200).json(result);
            else
                res.status(400).json({ error: 'Could not create profile' });
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: e.message });
        }
    }
    static async UpdateProfile(req, res) {
        const formData = req.body;
        try {
            const { userId } = req.session;
            // TODO: Ensure the profile belongs to the authenticated user
            const userProfiles = await models_1.profiles.getAllByUserId(userId);
            const profileBelongsToUser = userProfiles.some(profile => profile.id === formData.id);
            if (!profileBelongsToUser) {
                res.status(403).json({ error: 'Forbidden - Profile does not belong to user' });
                return;
            }
            const result = await models_1.profiles.update(formData.id, formData);
            if (result)
                res.status(200).json(result);
            else
                res.status(404).json({ error: 'Profile not found' });
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: e.message });
        }
    }
    static async DeleteProfile(req, res) {
        try {
            const { userId } = req.session;
            const profileId = req.query.id;
            if (!profileId) {
                res.status(400).json({ error: 'Profile ID is required' });
                return;
            }
            // Ensure the profile belongs to the authenticated user
            const userProfiles = await models_1.profiles.getAllByUserId(userId);
            const profileBelongsToUser = userProfiles.some(profile => profile.id === profileId);
            if (!profileBelongsToUser) {
                res.status(403).json({ error: 'Forbidden - Profile does not belong to user' });
                return;
            }
            const result = await models_1.profiles.delete(profileId);
            if (result)
                res.status(200).json({ success: 'Profile deleted' });
            else
                res.status(404).json({ error: 'Profile not found' });
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: e.message });
        }
    }
}
exports.default = ProfileController;
