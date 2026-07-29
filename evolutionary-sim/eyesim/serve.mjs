/**
 * Static server for viewer.html.
 *
 * The viewer imports core/*.mjs inside a module Worker, which browsers block over
 * file:// — so the page needs to be served. This is the whole reason this file
 * exists; it does nothing else.
 *
 *   bun evolutionary-sim/eyesim/serve.mjs
 */
import { fileURLToPath } from 'node:url';
import { join, extname, normalize } from 'node:path';
import { readFileSync, existsSync, statSync } from 'node:fs';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.PORT ?? 5178);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

Bun.serve({
  port: PORT,
  fetch(req) {
    let path = decodeURIComponent(new URL(req.url).pathname);
    if (path === '/') path = '/viewer.html';

    // Contain everything under ROOT.
    const full = normalize(join(ROOT, path));
    if (!full.startsWith(normalize(ROOT))) return new Response('forbidden', { status: 403 });
    if (!existsSync(full) || !statSync(full).isFile()) {
      return new Response('not found: ' + path, { status: 404 });
    }
    return new Response(readFileSync(full), {
      headers: {
        'content-type': TYPES[extname(full)] ?? 'application/octet-stream',
        'cache-control': 'no-store',
      },
    });
  },
});

console.log(`eyesim viewer:  http://localhost:${PORT}/`);
console.log(`serving:        ${ROOT}`);
