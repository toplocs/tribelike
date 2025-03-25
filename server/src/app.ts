import express from 'express';
import session from 'express-session';

import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import https from "https";
import http from "http";
import { handleError } from './middleware/error';
import routes from './routes';

import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger_output.json";

import { 
  sessionSecret, corsOptions, cookieOptions, 
  rpID, port, enable_https, certificate } from './config';

const app = express();

// In Memory Session Store for Login and Register
// TODO: We want to use JWT only - no session store
declare module 'express-session' {
  interface SessionData {
    currentChallengeOptions?: PublicKeyCredentialCreationOptionsJSON | PublicKeyCredentialRequestOptionsJSON;
    loggedInUser: {id: string, name: string} | null;
  }
}

app.use(
  session({
    secret: sessionSecret,
    saveUninitialized: true,
    resave: false,
    cookie: cookieOptions,
  }),
);

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(handleError);

// Routes
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));
app.use('/', routes);


// STATIC SERVER OLD: Why views?
// app.use(express.static(path.join(__dirname, 'views')));  
// app.get('*', (req: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, 'views', 'index.html'));
// });

// Serve static client
const clientBuildPath = path.join(__dirname, '../../client/dist');
console.log("Client folder:", clientBuildPath);
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
} else {
  app.get('/', (req, res) => {
    res.send(`Client build folder does not exist. Not serving client`);
  });
}

if (enable_https) {
  const server = https.createServer(certificate, app);
  server.listen(port, rpID, () => {
    console.log(`🚀 HTTPS Server ready at https://${rpID}:${port}`);
  });
} else {
  http.createServer(app).listen(port, rpID, () => {
    console.log(`🚀 HTTP Server ready at http://${rpID}:${port}`);
  });
}
