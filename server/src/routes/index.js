"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const v1_1 = __importDefault(require("./v1"));
const v2_1 = __importDefault(require("./v2"));
const routers = {
    v1: v1_1.default,
    v2: v2_1.default,
};
// Versioned routes 
const router = (0, express_1.Router)();
// Default to latest version
router.use(`/api`, v2_1.default);
// Add versioned routes
router.use(`/api/v2`, v2_1.default);
router.use(`/api/v1`, v1_1.default);
// Fallback to previous version if a route is not available in the current version
function fallback(req) {
    if (!req.path.startsWith('/v')) {
        return "v1";
    }
    else if (req.path.includes('/v2/')) {
        return "v1";
    }
    return "";
}
router.use((req, res, next) => {
    if (!res.pageFound && req.path.startsWith('/api/')) {
        const nextVersion = fallback(req);
        console.log("Fallback to version:", nextVersion);
        res.pageFound = undefined;
        if (nextVersion !== "") {
            let fallbackUrl = req.originalUrl;
            console.log("Fallback URL:", fallbackUrl);
            if (!req.path.startsWith('/api/v')) {
                fallbackUrl = fallbackUrl.replace('/api', `/api/${nextVersion}`);
            }
            else {
                const path = req.path.split('/');
                const version = path[2];
                fallbackUrl = fallbackUrl.replace(`/api/${version}/`, `/api/${nextVersion}/`);
            }
            console.log("Fallback URL:", fallbackUrl);
            res.redirect(fallbackUrl); // Can we omit the redirect?
            return;
        }
    }
    next();
});
exports.default = router;
