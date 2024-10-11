"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const activity_1 = __importDefault(require("./api/activity"));
const auth_1 = __importDefault(require("./api/auth"));
const user_1 = __importDefault(require("./api/user"));
const profile_1 = __importDefault(require("./api/profile"));
const interest_1 = __importDefault(require("./api/interest"));
const location_1 = __importDefault(require("./api/location"));
dotenv_1.default.config();
const { URL, PORT, DEVELOPMENT } = process.env;
if (!URL)
    console.error('URL not defined!');
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)({
    origin: URL,
    optionsSuccessStatus: 200
}));
if (!DEVELOPMENT)
    app.use(express_1.default.static(path_1.default.join(__dirname, 'views')));
app.use('/api/activity', activity_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/user', user_1.default);
app.use('/api/profile', profile_1.default);
app.use('/api/interest', interest_1.default);
app.use('/api/location', location_1.default);
if (DEVELOPMENT == 'true') {
    app.get('/', (req, res) => res.redirect(URL));
}
else {
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, 'views', 'index.html'));
    });
}
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
