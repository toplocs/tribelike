import express, { Request, Response } from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import prisma from './lib/prisma';

import authRouter from './api/auth';
import userRouter from './api/user';
import profileRouter from './api/profile';
import interestRouter from './api/interest';
import locationRouter from './api/location';

dotenv.config();

const { URL, PORT } = process.env;
if (!URL) console.error('URL not defined!')

const app = express();
const httpServer = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors({
  origin: URL,
  optionsSuccessStatus: 200
}));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/profile', profileRouter);
app.use('/api/interest', interestRouter);
app.use('/api/location', locationRouter);

app.get('/', (req: Request, res: Response) => res.redirect(URL as string));


httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
