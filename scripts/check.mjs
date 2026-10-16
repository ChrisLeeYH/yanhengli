// Verify generated HTML, local assets, and links before deploying to GitHub Pages.
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../public/', import.meta.url));
const home = await readFile(path.join(root, 'index.html'), 'utf8');
const canonical = home.match(/<link rel="canonical" href="([^"]+)"/);
if (!canonical) throw new Error('Homepage needs a canonical URL');
const base = new URL(canonical[1]);
const decode = text => text.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const errors = [];
const html = [];
async function collect(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, item.name);
    if (item.isDirectory()) await collect(file);
    else if (file.endsWith('.html')) html.push(file);
  }
}
await collect(root);
let links = 0;
for (const file of html) {
  const body = await readFile(file, 'utf8');
  const relative = path.relative(root, file).replaceAll(path.sep, '/');
  const pageUrl = new URL(relative.replace(/index\.html$/, ''), base);
  for (const required of ['<title>', 'name="description"', 'name="viewport"', '<main id="main">', 'Skip to content']) {
    if (!body.includes(required)) errors.push(`${relative}: missing ${required}`);
  }
  if ((body.match(/<h1\b/g) || []).length !== 1) errors.push(`${relative}: needs exactly one h1`);
  for (const match of body.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const href = decode(match[1]);
    if (/^(mailto:|data:|tel:)/.test(href)) continue;
    const target = new URL(href, pageUrl);
    if (target.origin !== base.origin) continue;
    links++;
    if (!target.pathname.startsWith(base.pathname)) { errors.push(`${relative}: link escapes site prefix: ${href}`); continue; }
    let local = path.join(root, decodeURIComponent(target.pathname.slice(base.pathname.length)));
    try {
      if ((await stat(local)).isDirectory()) local = path.join(local, 'index.html');
      await stat(local);
      if (target.hash && local.endsWith('.html')) {
        const contents = await readFile(local, 'utf8');
        const id = decodeURIComponent(target.hash.slice(1));
        if (!contents.includes(`id="${id}"`)) errors.push(`${relative}: missing anchor ${href}`);
      }
    } catch { errors.push(`${relative}: missing local target ${href}`); }
  }
  for (const image of body.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="[^"]+"/.test(image[0])) errors.push(`${relative}: image missing meaningful alt text`);
  }
  if (/example\.com|Hugo Blox|GetResearchDev|Undergraudate|Techonology|about to join/i.test(body)) errors.push(`${relative}: stale template/profile copy`);
}
for (const preserved of ['experience/index.html', 'publications/index.html', 'publications/cscw-paper/index.html', 'publications/cikm-paper/index.html', 'publications/crisis-paper-submission/index.html', 'authors/admin/index.html', 'uploads/resume.pdf', 'index.xml', 'publications/index.xml', '.nojekyll', 'sitemap.xml', 'robots.txt']) {
  try { await stat(path.join(root, preserved)); } catch { errors.push(`Missing preserved route/artifact: ${preserved}`); }
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Checked ${html.length} HTML pages and ${links} internal links at ${base.pathname}; preserved routes and assets are valid.`);
