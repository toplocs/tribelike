import express, { Request, Response } from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import activityRouter from './api/activity';
import authRouter from './api/auth';
import discussionRouter from './api/discussion';
import interestRouter from './api/interest';
import locationRouter from './api/location';
import pluginRouter from './api/plugin';
import profileRouter from './api/profile';
import relationRouter from './api/relation';
import userRouter from './api/user';

dotenv.config();

const { URL, MOBILE_URL, PORT, DEVELOPMENT } = process.env;
if (!URL) console.error('URL not defined!')

const app = express();
const httpServer = http.createServer(app);

const allowedOrigins = [
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:8080',
  'http://localhost:8100',
  'http://192.168.1.12:8100'
];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors(options));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

if (DEVELOPMENT != 'true') app.use(express.static(path.join(__dirname, 'views')));

app.use('/api/activity', activityRouter);
app.use('/api/auth', authRouter);
app.use('/api/discussion', discussionRouter);
app.use('/api/interest', interestRouter);
app.use('/api/location', locationRouter);
app.use('/api/plugin', pluginRouter);
app.use('/api/profile', profileRouter);
app.use('/api/relation', relationRouter);
app.use('/api/user', userRouter);

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
