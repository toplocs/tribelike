import express from 'express';
import http from 'http';
import path from 'path';
import Gun from 'gun';

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname,  'views')));

const server = http.createServer(app);

// Attach GunDB to the same HTTP server
Gun({ web: server });

server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`🔫 GunDB running at http://localhost:${port}/gun`);
});
