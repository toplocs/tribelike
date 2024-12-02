import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = 3000;

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'components', 'test', 'Test.4567d7a1b3f66876.umd.min.js');

app.use(express.static(path.resolve(__dirname, 'components', 'test'), {
  maxAge: '365d',
}));

app.listen(PORT);

console.log(`Listening on: http://localhost:${PORT}`);