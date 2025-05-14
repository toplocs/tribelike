"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
exports.CustomError = CustomError;
const handleError = (err, res) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.log(message);
    res.status(statusCode).send(message);
};
exports.handleError = handleError;
