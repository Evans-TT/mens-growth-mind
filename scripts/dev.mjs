import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, resolve } from 'node:path';

const root = resolve(process.cwd(), process.argv[2] || 'src');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };

createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  let filePath = join(root, decodeURIComponent(url.pathname));
  if (url.pathname.startsWith('/assets/')) filePath = join(process.cwd(), 'public', decodeURIComponent(url.pathname.slice(8)));
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) filePath = join(root, 'index.html');
  response.writeHead(200, { 'Content-Type': types[extname(filePath)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  createReadStream(filePath).pipe(response);
}).listen(port, '127.0.0.1', () => console.log(`MGM prototype running at http://127.0.0.1:${port}`));
