import { Router, Request } from 'express';
import routerV1 from './v1';
import routerV2 from './v2';

// TODO: generate open API documentation

declare global {
    namespace Express {
        interface Response {
            pageFound?: boolean;
        }
    }
}

const routers = {
    v1: routerV1,
    v2: routerV2,
};

// Versioned routes 
const router = Router();

// Default to latest version
router.use(`/api`, routerV2);

// Add versioned routes
router.use(`/api/v2`, routerV2);
router.use(`/api/v1`, routerV1);

// Fallback to previous version if a route is not available in the current version
function fallback(req: Request): keyof typeof routers | "" {
    if (!req.path.startsWith('/v')) {
        return "v1";
    } else if (req.path.includes('/v2/')) {
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
            } else {
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

export default router;
