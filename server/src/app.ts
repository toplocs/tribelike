import express from 'express';

import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import https from "https";
import http from "http";
import { sessionMiddleware } from './middleware';
import routes from './routes';
import { initGun } from './gun';

import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger_output.json";

import { 
  corsOptions, 
  rpID, port, enable_https, certificate } from './config';

declare global {
  namespace Express {
    interface Request {
      session: {
        userId: string;
        loggedIn: boolean;
        token: string;
        expires: Date;
      }
    }
  }
}
const app = express();

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Serve docs 
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));
// Read Authentication Token from Header and add session to request
//app.use(sessionMiddleware);

// Serve static files from src/views
const viewsPath = path.join(__dirname, 'views');
app.use(express.static(viewsPath));

// 1. Static files
app.use(express.static(viewsPath));

// 2. Real routes (docs, API, etc.)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));
app.use('/api', routes);

// 3. Catch-all for SPA (after all others)
app.get(/^\/(?!api|docs).*/, (req, res) => {
  res.sendFile(path.join(viewsPath, 'index.html'));
});


function startServer() {
  if (enable_https) {
    console.log(`starting https server on ${port}...`);
    const server = https.createServer(certificate, app);
    server.listen(port, rpID, () => {
      console.log(`🚀 HTTPS Server ready at https://${rpID}:${port}`);
    });

    return server;
  } else {
    console.log(`Starting http server on ${port}...`);
    const server = http.createServer(app).listen(port, rpID, () => {
      console.log(`🚀 HTTP Server ready at http://${rpID}:${port}`);
    });

    return server;
  }
}

if (require.main === module) {
  const server = startServer();
  initGun(server);
}
