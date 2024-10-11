import express, { Request, Response } from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import prisma from './lib/prisma';

import activityRouter from './api/activity';
import authRouter from './api/auth';
import userRouter from './api/user';
import profileRouter from './api/profile';
import interestRouter from './api/interest';
import locationRouter from './api/location';

dotenv.config();

const { URL, PORT, DEVELOPMENT } = process.env;
if (!URL) console.error('URL not defined!')

const app = express();
const httpServer = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors({
  origin: URL,
  optionsSuccessStatus: 200
}));
if (!DEVELOPMENT) app.use(express.static(path.join(__dirname, 'views')));

app.use('/api/activity', activityRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/profile', profileRouter);
app.use('/api/interest', interestRouter);
app.use('/api/location', locationRouter);

if (DEVELOPMENT == 'true') {
  app.get('/', (req: Request, res: Response) => res.redirect(URL as string));
} else {
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
  });
}


httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
