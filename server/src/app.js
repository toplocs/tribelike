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
const gun_1 = __importDefault(require("gun"));
const middleware_1 = require("./middleware");
const routes_1 = __importDefault(require("./routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_output_json_1 = __importDefault(require("./swagger_output.json"));
const config_1 = require("./config");
const app = (0, express_1.default)();
app.use((0, cors_1.default)(config_1.corsOptions));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// Serve docs 
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default));
// Serve static client
const clientBuildPath = path_1.default.join(__dirname, '../../client/dist');
console.log("Client folder:", clientBuildPath);
if (fs_1.default.existsSync(clientBuildPath)) {
    app.use(express_1.default.static(clientBuildPath));
}
else {
    app.get('/', (req, res) => {
        res.send(`Client build folder does not exist. Not serving client`);
    });
}
// Read Authentication Token from Header and add session to request
app.use(middleware_1.sessionMiddleware);
app.use('/', routes_1.default);
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
    const gun = (0, gun_1.default)({ web: server, file: 'ra-data' });
    const chatRoomNode = gun.get('tribelike').get('chat-room');
    chatRoomNode.get('messages').on((message, key) => {
        console.log('New message:', message);
        console.log('Message key:', key);
    });
    // To listen for any other events (like message updates or removals), you can use the following pattern:
    chatRoomNode.on((data) => {
        console.log('Chat room state changed:', data);
    });
    setInterval(() => {
    });
}
