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
const app = (0, express_1.default)();
app.use((0, cors_1.default)(config_1.corsOptions));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// Serve static client
const viewsBuildPath = path_1.default.join(__dirname, './views');
console.log("Views folder:", viewsBuildPath);
if (fs_1.default.existsSync(viewsBuildPath)) {
    app.use(express_1.default.static(viewsBuildPath));
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
