"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const doc = {
    info: {
        version: 'v1.0.0',
        title: 'Tribelike API',
        description: ''
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: ''
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
            }
        }
    }
};
const outputFile = './swagger_output.json';
const endpointsFiles = [
    './routes/index.ts',
];
(0, swagger_autogen_1.default)({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);
