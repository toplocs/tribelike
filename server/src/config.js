"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificate = exports.cookieOptions = exports.corsOptions = exports.origin = exports.rpID = exports.rpName = exports.port = exports.enable_https = exports.url = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
exports.url = process.env.URL || 'http://localhost:3000';
exports.enable_https = process.env.HTTPS === 'true';
exports.port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
exports.rpName = 'TribeLike';
exports.rpID = process.env.RPID || 'localhost';
exports.origin = [
    `http://${exports.rpID}:${exports.port}`,
    `https://${exports.rpID}:${exports.port}`,
    `http://localhost:5173`,
    `https://localhost:5173`
];
exports.corsOptions = {
    origin: exports.origin,
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE']
};
exports.cookieOptions = {
    maxAge: 86400000,
    httpOnly: true,
    sameSite: 'lax', // Works well in development
    secure: false, // Allow cookies over HTTP for localhost
};
const certificatesKey = `${__dirname}/../../localhost-key.pem`;
const certificatesCert = `${__dirname}/../../localhost.pem`;
let certificate = { key: '', cert: '' };
exports.certificate = certificate;
if (exports.enable_https) {
    try {
        certificate.key = fs_1.default.readFileSync(certificatesKey, 'utf8');
        certificate.cert = fs_1.default.readFileSync(certificatesCert, 'utf8');
    }
    catch (error) {
        console.error('Certificate files are not found. Please create them to enable HTTPS');
        process.exit(1);
    }
}
