import express from 'express';
import http from 'http';
import path from 'path';
import Gun from 'gun';

const app = express();
const port = 3000;

// Serve static files from 'views' inside dist/
app.use(express.static(path.join(__dirname, 'views')));

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

const server = http.createServer(app);

// Attach GunDB to the HTTP server
Gun({ web: server });

server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`🔫 GunDB running at http://localhost:${port}/gun`);
});
