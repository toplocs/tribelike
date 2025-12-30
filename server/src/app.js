"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const gun_1 = require("./gun");
const config_1 = require("./config");
const pinata_1 = require("./pinata");
const app = (0, express_1.default)();
app.use((0, cors_1.default)(config_1.corsOptions));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// API Routes
app.post('/api/v2/pinata/upload-url', async (req, res) => {
    try {
        const { maxUploadSize, expiresIn } = req.body;
        const signedUrl = await (0, pinata_1.generateSignedUploadUrl)(maxUploadSize, expiresIn);
        res.json(signedUrl);
    }
    catch (error) {
        console.error('Error generating signed upload URL:', error);
        res.status(500).json({
            error: 'Failed to generate signed upload URL',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Serve static client
const viewsBuildPath = path_1.default.join(__dirname, './views');
const indexPath = path_1.default.join(viewsBuildPath, 'index.html');
console.log("Views folder:", viewsBuildPath);
if (fs_1.default.existsSync(viewsBuildPath)) {
    app.use(express_1.default.static(viewsBuildPath));
    // SPA fallback: serve index.html for all non-API routes
    // This allows Vue Router to handle client-side routing
    app.get(/^(?!\/api)/, (req, res) => {
        // Don't serve index.html for API routes (they should 404 if not handled)
        if (req.path.startsWith('/api')) {
            res.status(404).json({ error: 'Not found' });
            return;
        }
        if (fs_1.default.existsSync(indexPath)) {
            res.sendFile(indexPath);
        }
        else {
            res.status(404).send('index.html not found');
        }
    });
}
else {
    app.get('/', (req, res) => {
        res.send(`Views build folder does not exist. Not serving client`);
    });
}
function startServer() {
    if (config_1.enable_https) {
        console.log(`starting https server on ${config_1.port}...`);
        const server = https_1.default.createServer(config_1.certificate, app);
        server.listen(config_1.port, config_1.rpID, () => {
            console.log(`🚀 HTTPS Server ready at https://${config_1.rpID}:${config_1.port}`);
        });
        return server;
    }
    else {
        console.log(`Starting http server on ${config_1.port}...`);
        const server = http_1.default.createServer(app).listen(config_1.port, config_1.rpID, () => {
            console.log(`🚀 HTTP Server ready at http://${config_1.rpID}:${config_1.port}`);
        });
        return server;
    }
}
if (require.main === module) {
    const server = startServer();
    (0, gun_1.initGun)(server);
}
