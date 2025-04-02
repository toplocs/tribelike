import express from 'express';

import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import https from "https";
import http from "http";
import { session, handleError } from './middleware';
import routes from './routes';

import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger_output.json";

import { 
  corsOptions, 
  rpID, port, enable_https, certificate } from './config';

const app = express();

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(handleError);

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

// Serve docs 
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

// Read Authentication Token from Header and add auth session to request
app.use(session);
app.use('/', routes);

function startServer() {
  if (enable_https) {
    console.log(`starting https server on ${port}...`);
    const server = https.createServer(certificate, app);
    server.listen(port, rpID, () => {
      console.log(`🚀 HTTPS Server ready at https://${rpID}:${port}`);
    });
  } else {
    console.log(`Starting http server on ${port}...`);
    http.createServer(app).listen(port, rpID, () => {
      console.log(`🚀 HTTP Server ready at http://${rpID}:${port}`);
    });
  }
}

if (require.main === module) {
  startServer();
}
