import express, { Request, Response } from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';


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

const { CLIENT_URL, PORT, DEVELOPMENT } = process.env;
if (!CLIENT_URL) console.error('CLIENT_URL not defined!')

const app = express();
const httpServer = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(morgan('dev'));

app.use(cors({
  origin: CLIENT_URL,
  optionsSuccessStatus: 200
}));

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
  app.get('/', (req: Request, res: Response) => res.redirect(CLIENT_URL as string));
} else {
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
  });
}

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Mode: ${DEVELOPMENT == 'true' ? 'Development' : 'Production'}`);
});



// https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
// var privateKey = fs.readFileSync( 'privatekey.pem' );
// var certificate = fs.readFileSync( 'certificate.pem' );

// https.createServer({
//     key: privateKey,
//     cert: certificate
// }, app).listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });