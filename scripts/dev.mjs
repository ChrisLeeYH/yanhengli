import http from 'node:http';
import { readFile, stat, watch } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'public');
const port = Number(process.env.PORT || 4173);
const localBase = `http://127.0.0.1:${port}/yanhengli/`;
const prefix = new URL(localBase).pathname;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.bib': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };
let building = false;
let pending = false;
async function build() {
  if (building) { pending = true; return; }
  building = true;
  try {
    await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, ['scripts/build.mjs', '--base-url', localBase], { cwd: root, stdio: 'inherit' });
      child.on('error', reject);
      child.on('exit', code => code === 0 ? resolve() : reject(new Error(`Build exited ${code}`)));
    });
  } finally { building = false; }
  if (pending) { pending = false; await build(); }
}
await build();
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, localBase).pathname);
    if (pathname === '/' || pathname === prefix.slice(0, -1)) { res.writeHead(302, { Location: prefix }); res.end(); return; }
    if (!pathname.startsWith(prefix)) { res.writeHead(404); res.end('Not found'); return; }
    let target = path.resolve(output, `.${pathname.slice(prefix.length - 1)}`);
    if (!target.startsWith(`${output}${path.sep}`) && target !== output) { res.writeHead(403); res.end(); return; }
    try {
      if ((await stat(target)).isDirectory()) {
        if (!pathname.endsWith('/')) { res.writeHead(302, { Location: `${pathname}/` }); res.end(); return; }
        target = path.join(target, 'index.html');
      }
      const body = await readFile(target);
      res.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(body);
    } catch { res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(await readFile(path.join(output, '404.html'))); }
  } catch { res.writeHead(400); res.end('Bad request'); }
});
server.on('error', error => { console.error(error.message); process.exit(1); });
server.listen(port, '127.0.0.1', () => console.log(`Local: ${localBase}`));
let debounce;
for (const directory of ['data', 'static', 'scripts']) {
  (async () => {
    for await (const event of watch(path.join(root, directory), { recursive: true })) {
      if (!event.filename || event.filename.endsWith('dev.mjs')) continue;
      clearTimeout(debounce);
      debounce = setTimeout(() => build().catch(console.error), 150);
    }
  })().catch(console.error);
}
