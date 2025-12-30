import express from 'express';

import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import https from "https";
import http from "http";
import { initGun } from './gun';

import {
  corsOptions,
  rpID, port, enable_https, certificate } from './config';
import { generateSignedUploadUrl } from './pinata';

const app = express();

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// API Routes
app.post('/api/v2/pinata/upload-url', async (req, res) => {
  try {
    const { maxUploadSize, expiresIn } = req.body;
    const signedUrl = await generateSignedUploadUrl(maxUploadSize, expiresIn);
    res.json(signedUrl);
  } catch (error) {
    console.error('Error generating signed upload URL:', error);
    res.status(500).json({
      error: 'Failed to generate signed upload URL',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Serve static client
const viewsBuildPath = path.join(__dirname, './views');
const indexPath = path.join(viewsBuildPath, 'index.html');
console.log("Views folder:", viewsBuildPath);
if (fs.existsSync(viewsBuildPath)) {
  app.use(express.static(viewsBuildPath));

  // SPA fallback: serve index.html for all non-API routes
  // This allows Vue Router to handle client-side routing
  app.get(/^(?!\/api)/, (req, res) => {
    // Don't serve index.html for API routes (they should 404 if not handled)
    if (req.path.startsWith('/api')) {
      res.status(404).json({ error: 'Not found' });
      return;
    }

    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('index.html not found');
    }
  });
} else {
  app.get('/', (req, res) => {
    res.send(`Views build folder does not exist. Not serving client`);
  });
}

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
