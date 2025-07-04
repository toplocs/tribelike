"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const session_1 = require("../../controllers/auth/session");
const router = (0, express_1.Router)();
router.get('/auth/session', session_1.handleGetSession);
router.post('/auth/logout', session_1.handleLogout);
// deprecated
router.get('/session', session_1.handleGetSession);
router.post('/logout', session_1.handleLogout);
exports.default = router;
