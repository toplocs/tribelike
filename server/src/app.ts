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

// Gun relay will handle /gun WebSocket connections at HTTP server level
// We need to skip /gun in Express so it can be handled at the HTTP server level

// Skip /gun requests - the HTTP server's upgrade handler will manage WebSocket connections
// For non-upgrade requests, return 200 to indicate the endpoint exists
app.use('/gun', (req, res) => {
  // Gun client might check if endpoint exists via GET before upgrading to WebSocket
  // Just return 200 OK - the HTTP server will handle the actual WebSocket upgrade
  if (req.headers.upgrade && req.headers.upgrade.toLowerCase() === 'websocket') {
    // This shouldn't happen as the HTTP server should handle it first
    // But just in case, don't do anything - let it fall through
    return;
  }
  res.status(200).end();
});

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
  // Exclude /gun because Gun handles WebSocket upgrades at the HTTP server level
  app.get(/^(?!\/api|\/gun)/, (req, res) => {
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

      // Initialize Gun AFTER listening
      console.log('⚡ Initializing Gun relay...');
      try {
        const gunInstance = initGun(server);
        console.log('⚡ Gun relay initialised');
      } catch (error) {
        console.error('⚡ Gun relay failed:', error);
      }

      console.log(`🔫 Gun relay available at wss://${rpID}:${port}/gun`);
    });

    return server;
  } else {
    console.log(`Starting http server on ${port}...`);
    const server = http.createServer(app);

    // DO NOT initialize Gun here - we'll do it after listening
    // This ensures the server is fully set up before Gun attaches handlers

    server.listen(port, rpID, () => {
      console.log(`🚀 HTTP Server ready at http://${rpID}:${port}`);

      // NOW initialize Gun after server is listening
      console.log('⚡ Initializing Gun relay...');
      try {
        const gunInstance = initGun(server);
        console.log('⚡ Gun relay initialised');
      } catch (error) {
        console.error('⚡ Gun relay failed:', error);
      }

      console.log(`🔫 Gun relay available at ws://${rpID}:${port}/gun`);
    });

    return server;
  }
}

if (require.main === module) {
  startServer();
}
