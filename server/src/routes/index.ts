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

Object.entries(routers).forEach(([version, versionedRouter]) => {
    router.use(`/${version}`, versionedRouter);
});

// Default to latest version
router.use(`/`, routers.v1);

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
    if (!res.pageFound) {
        const nextVersion = fallback(req);
        res.pageFound = undefined;
        if (nextVersion !== "") {
            let fallbackUrl = req.originalUrl;
            if (!req.path.startsWith('/v')) {
                fallbackUrl = fallbackUrl.replace('api', `api/${nextVersion}`);
            } else {
                const path = req.path.split('/');
                const version = path[1];
                fallbackUrl = fallbackUrl.replace(`/${version}/`, `/${nextVersion}/`);
            }
            res.redirect(fallbackUrl);
            return;
        }
    }
    next();
});

export default router;
