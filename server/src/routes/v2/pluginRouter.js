"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gun_1 = require("../../gun");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    try {
        const gun = (0, gun_1.getGun)();
        gun.get('plugins').once((data) => {
            if (!data) {
                return res.status(404).json({ message: 'No plugin data found' });
            }
            res.json(data);
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.default = router;
