import Gun from 'gun';
import http from 'http';

console.log('🔫 Starting minimal Gun.js relay server...');

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Gun.js P2P relay server running\n');
});

// Attach Gun relay to HTTP server
// Gun will handle WebSocket upgrade at /gun by default
const gun = Gun({
  web: server,
});

console.log('⚡ Gun relay attached to HTTP server');

const port = parseInt(process.env.PORT || '3000');
const host = process.env.RPID || 'localhost';

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

server.listen(port, host, () => {
  console.log(`✓ Gun relay server listening on http://${host}:${port}`);
  console.log(`✓ WebSocket relay available at ws://${host}:${port}/gun`);
  console.log(`✓ Ready for P2P peer connections`);
  console.log(`\n📡 Waiting for peer connections...`);
});
