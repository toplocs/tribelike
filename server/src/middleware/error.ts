import { Request, Response, NextFunction } from 'express';

export interface ErrorWithStatus extends Error {
    statusCode?: number;
}

export class CustomError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

export const handleError = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.log(message)
    res.status(statusCode).send({ error: message });
};

