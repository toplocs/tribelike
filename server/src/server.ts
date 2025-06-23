import express from 'express';
import http from 'http';
import path from 'path';
import Gun from 'gun';

const app = express();
const port = 3000;

// Serve static files - check if we're in dev or production
const viewsPath = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, 'views')
  : path.join(__dirname, '..', 'dist', 'views');

app.use(express.static(viewsPath));

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(viewsPath, 'index.html'));
});

const server = http.createServer(app);

// Attach GunDB to the HTTP server
Gun({ web: server });

server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`🔫 GunDB running at http://localhost:${port}/gun`);
});
