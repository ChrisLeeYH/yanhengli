import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const site = JSON.parse(await readFile(path.join(root, 'data/site.json'), 'utf8'));
const argument = process.argv.indexOf('--base-url');
if (argument !== -1 && !process.argv[argument + 1]) throw new Error('--base-url requires an absolute URL');
const base = new URL(argument === -1 ? (process.env.SITE_BASE_URL || site.siteUrl) : process.argv[argument + 1]);
if (!['http:', 'https:'].includes(base.protocol) || base.search || base.hash) throw new Error('Use an HTTP(S) base URL without a query or fragment');
base.pathname = base.pathname.replace(/\/?$/, '/');
const output = path.join(root, 'public');
const e = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const url = value => /^(https?:|mailto:)/.test(value) ? value : `${base.pathname}${value.replace(/^\//, '')}`;
const arrow = '<span aria-hidden="true">↗</span>';
const link = (label, href, cls = '') => `<a${cls ? ` class="${cls}"` : ''} href="${e(url(href))}">${e(label)} ${arrow}</a>`;
const bio = site.bio.map(part => typeof part === 'string' ? e(part) : `<a href="${e(url(part.url))}">${e(part.text)}</a>`).join('');
const authors = names => names.map(name => name === site.name ? `<strong>${e(name)}</strong>` : e(name)).join(', ');
const year = site.updated.slice(0, 4);
const updatedLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${site.updated}T00:00:00Z`));
const routes = [];

function navItem(label, href, key, current) {
  return `<a href="${e(url(href))}"${key && key === current ? ' aria-current="page"' : ''}>${label}</a>`;
}

function shell(title, content, { route = '', active = '', description = site.description, article = false, noindex = false } = {}) {
  const absolute = new URL(route, base).href;
  const schema = article ? null : { '@context': 'https://schema.org', '@type': 'Person', name: site.name, alternateName: site.chineseName, url: base.href, image: new URL('images/portrait.jpg', base).href, jobTitle: 'Ph.D. student', affiliation: { '@type': 'CollegeOrUniversity', name: 'Northwestern University' }, sameAs: [site.scholar, site.github, site.x] };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(title ? `${title} — ${site.name}` : `${site.name} · Northwestern University`)}</title>
<meta name="description" content="${e(description)}"><meta name="theme-color" content="#f8f6f1">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${e(absolute)}">`}
<meta property="og:type" content="${article ? 'article' : 'website'}"><meta property="og:title" content="${e(title || site.name)}"><meta property="og:description" content="${e(description)}"><meta property="og:url" content="${e(absolute)}"><meta property="og:image" content="${e(new URL('images/portrait.jpg', base).href)}"><meta property="og:site_name" content="${e(site.name)}">
<meta name="twitter:card" content="summary"><link rel="icon" href="${url('favicon.svg')}" type="image/svg+xml">
<link rel="stylesheet" href="${url('styles.css')}"><script src="${url('site.js')}" defer></script>
${schema ? `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>` : ''}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<div class="top-rule"></div>
<header class="site-header wrap">
  <a class="wordmark" href="${url('')}" aria-label="Yanheng Li, home">yl<span>.</span></a>
  <nav aria-label="Main navigation">
    ${navItem('About', '#about', 'home', active)}
    ${navItem('Research', '#research', '', active)}
    ${navItem('Publications', '#papers', 'publications', active)}
    ${navItem('News', '#news', '', active)}
    ${navItem('Experience', 'experience/', 'experience', active)}
  </nav>
  <a class="header-contact" href="mailto:${e(site.email)}">Get in touch ${arrow}</a>
</header>
<main id="main">${content}</main>
<footer class="site-footer wrap">
  <div><a class="footer-name" href="${url('')}">${e(site.name)} <span lang="zh-Hans">${e(site.chineseName)}</span></a><p>Media, Technology, and Society · Northwestern University</p></div>
  <div class="footer-meta"><p>© ${year} ${e(site.name)}</p><p>Updated ${e(updatedLabel)}</p><a href="#main">Back to top ↑</a></div>
</footer>
</body></html>`;
}

function publication(p, index) {
  return `<article class="publication">
  <div class="publication-index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</div>
  <div class="publication-body"><div class="publication-meta"><span>${e(p.venue)}</span>${p.award ? `<span class="award">${e(p.award)}</span>` : ''}${p.type === 'preprint' ? '<span class="preprint-label">Preprint</span>' : ''}</div>
  <h3><a href="${url(`publications/${p.slug}/`)}">${e(p.title)}</a></h3>
  <p class="authors">${authors(p.authors)}</p><p class="paper-summary">${e(p.summary)}</p>
  <div class="paper-links">${p.links.map(l => link(l.label, l.url)).join('')}${link('BibTeX', p.bib)}</div>
  </div></article>`;
}

function education() {
  return site.education.map(item => `<div class="education-row"><div><h3>${e(item.institution)}</h3><p>${e(item.degree)}</p></div><div class="education-date">${e(item.dates)}<span>${e(item.location)}</span></div></div>`).join('');
}

function currentWork(work) {
  const title = work.slug ? `<a href="${url(`publications/${work.slug}/`)}">${e(work.title)}</a>` : e(work.title);
  return `<article class="working-paper"><p class="small-label">${e(work.type === 'preprint' ? 'arXiv preprint' : work.status || 'Work in progress')}</p><h3>${title}</h3>${work.authors ? `<p class="authors">${authors(work.authors)}</p>` : ''}${work.note ? `<p class="paper-summary">${e(work.note)}</p>` : ''}${work.links ? `<div class="paper-links">${work.links.map(l => link(l.label, l.url)).join('')}${link('BibTeX', work.bib)}</div>` : ''}</article>`;
}

const home = `<section class="hero wrap" id="about" aria-labelledby="name">
  <div class="hero-copy"><p class="eyebrow">Communication · Technology · Society</p>
  <h1 id="name">Yanheng Li<span class="chinese-name" lang="zh-Hans">李彦恒</span></h1>
  <p class="hero-statement">Understanding information.<br><em>Understanding belief.</em></p>
  <p class="bio">${bio}</p>
  <div class="hero-links">${link('Email', `mailto:${site.email}`, 'button')}${link('Google Scholar', site.scholar)}${link('X', site.x)}${link('Curriculum vitae', site.cv)}</div>
  </div>
  <aside class="profile-note"><div class="portrait-frame"><img src="${url('images/portrait.jpg')}" width="276" height="276" alt="Portrait of Yanheng Li" fetchpriority="high"></div>
  <div class="profile-caption"><span class="small-label">Currently</span><p>Ph.D. student<br>Northwestern University</p><span class="location"><span aria-hidden="true">↳</span> Evanston, Illinois</span></div>
  </aside>
</section>
<section class="section wrap research-section" id="research" aria-labelledby="research-title">
  <div class="section-heading"><div><p class="section-number">01 / Research</p><h2 id="research-title">Information, people,<br><em>and the systems between.</em></h2></div><p class="section-intro">${e(site.method)}</p></div>
  <div class="research-grid">${site.research.map((r, i) => `<article><span class="research-mark" aria-hidden="true">${['↔', '◧', '⌘'][i]}</span><h3>${e(r.title)}</h3><p>${e(r.text)}</p></article>`).join('')}</div>
</section>
<section class="section wrap papers-section" id="papers" aria-labelledby="papers-title">
  <div class="section-heading"><div><p class="section-number">02 / Selected work</p><h2 id="papers-title">Publications <em>& preprints.</em></h2></div>${link('View all research', 'publications/', 'text-link')}</div>
  <div class="publication-list">${site.publications.map(publication).join('')}</div>
  <div class="ongoing"><p class="small-label">Current work</p><div><h3>${site.workingPapers.length + site.publications.filter(p => p.type === 'preprint').length} working papers · ${site.worksInProgress.length} projects in progress</h3><p>Research on crisis discussions, political livestreaming, rumor debunking, and AI-edited misinformation.</p></div>${link('View current work', 'publications/#working-papers')}</div>
</section>
<section class="section wrap news-section" id="news" aria-labelledby="news-title"><div><p class="section-number">03 / Along the way</p><h2 id="news-title">Recent <em>news.</em></h2></div><div class="news-list">${site.news.map(n => `<div class="news-row"><time datetime="${n.date}">${e(n.label)}</time><p>${n.href ? `<a href="${url(n.href)}">${e(n.text)}</a>` : e(n.text)}</p></div>`).join('')}</div></section>
<section class="section wrap background-section" aria-labelledby="background-title"><div class="section-heading"><div><p class="section-number">04 / Background</p><h2 id="background-title">A few <em>coordinates.</em></h2></div>${link('Experience & service', 'experience/', 'text-link')}</div><div class="education-list">${education()}</div><p class="personal-note">${e(site.personal)}</p></section>
<section class="contact-section" aria-labelledby="contact-title"><div class="wrap contact-inner"><div><p class="eyebrow">Let’s connect</p><h2 id="contact-title">Good research starts<br>with a <em>conversation.</em></h2><p>I’m always glad to connect with people thinking about communication, politics, and AI.</p></div><div class="contact-links">${link(site.email, `mailto:${site.email}`)}${link('Google Scholar', site.scholar)}${link('X', site.x)}</div></div></section>`;

async function page(route, html) {
  const target = path.join(output, route, 'index.html');
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, html);
  routes.push(route);
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(path.join(root, 'static'), output, { recursive: true });
await page('', shell('', home, { active: 'home' }));

const publicationPage = `<div class="wrap inner-page"><p class="eyebrow">Research</p><h1>Publications <em>& current work.</em></h1><p class="page-intro">Research in political communication, computer-mediated communication, and misinformation.</p><h2 class="group-title">Peer-reviewed publications</h2>${site.publications.filter(p => p.type === 'published').map(publication).join('')}<section aria-labelledby="working-papers"><h2 class="group-title" id="working-papers">Working papers</h2>${[...site.workingPapers, ...site.publications.filter(p => p.type === 'preprint')].map(currentWork).join('')}</section><section aria-labelledby="work-in-progress"><h2 class="group-title" id="work-in-progress">Selected works in progress</h2>${site.worksInProgress.map(currentWork).join('')}</section></div>`;
await page('publications/', shell('Publications', publicationPage, { route: 'publications/', active: 'publications' }));

for (const p of site.publications) {
  const route = `publications/${p.slug}/`;
  const bib = await readFile(path.join(root, 'static', p.bib), 'utf8');
  const content = `<article class="wrap article-page">${link('All publications', 'publications/', 'back-link')}<p class="eyebrow">${e(p.venue)}${p.type === 'preprint' ? ' · Not peer reviewed' : ''}</p><h1>${e(p.title)}</h1><p class="article-authors">${authors(p.authors)}</p><p class="citation">${e(p.citation)}</p>${p.award ? `<p class="article-award">${e(p.award)} · CSCW 2025</p>` : ''}<div class="paper-links article-links">${p.links.map(l => link(l.label, l.url)).join('')}${link('Download BibTeX', p.bib)}</div><div class="article-text"><h2>Overview</h2><p>${e(p.abstract)}</p></div><details class="citation-details"><summary>BibTeX citation</summary><pre><code id="citation">${e(bib)}</code></pre><button type="button" class="copy-citation" data-copy="citation">Copy citation</button><span class="copy-status" role="status" aria-live="polite"></span></details></article>`;
  await page(route, shell(p.title, content, { route, active: 'publications', description: p.summary, article: true }));
}

// Preserve the old URL without assuming which current manuscript it represents.
const workRoute = 'publications/crisis-paper-submission/';
await page(workRoute, shell('Current research', `<article class="wrap article-page"><p class="eyebrow">Research updates</p><h1>Current <em>working papers.</em></h1><div class="article-text"><p>My current manuscripts and projects are listed on the research page.</p>${link('View current working papers', 'publications/#working-papers', 'button')}</div></article>`, { route: workRoute, active: 'publications', noindex: true }));

const experience = `<div class="wrap inner-page experience-page"><p class="eyebrow">Background</p><h1>Experience <em>& education.</em></h1><p class="page-intro">Education, grants, recognition, and academic service.</p><div class="cv-note">${link('Download CV', site.cv)}<span>PDF · ${e(site.cvDate)}</span></div>
<section aria-labelledby="education-title"><h2 id="education-title" class="group-title">Education</h2>${education()}</section>
<section aria-labelledby="grants-title"><h2 id="grants-title" class="group-title">Grants</h2>${site.grants.map(g => `<div class="award-row"><span>${e(g.year)}</span><div><h3>${e(g.title)}</h3><p>${e(g.organization)}</p></div></div>`).join('')}</section>
<section aria-labelledby="awards-title"><h2 id="awards-title" class="group-title">Awards & honors</h2>${site.awards.map(a => `<div class="award-row"><span>${e(a.year)}</span><div><h3>${e(a.title)}</h3><p>${e(a.organization)}</p></div></div>`).join('')}</section>
<section aria-labelledby="conferences-title"><h2 id="conferences-title" class="group-title">Conferences & presentations</h2>${site.conferences.map(c => `<div class="award-row"><span>${e(c.date)}</span><div><h3>${e(c.title)}</h3><p>${e(c.location)}</p></div></div>`).join('')}</section>
<section aria-labelledby="service-title"><h2 id="service-title" class="group-title">Academic service</h2>${site.service.map(s => `<p>${e(s)}</p>`).join('')}</section>
<section aria-labelledby="skills-title"><h2 id="skills-title" class="group-title">Skills</h2>${site.skills.map(s => `<div class="experience-row"><h3>${e(s.label)}</h3><p>${e(s.items.join(' · '))}</p></div>`).join('')}</section></div>`;
await page('experience/', shell('Experience & education', experience, { route: 'experience/', active: 'experience' }));

// Keep the original author profile URL usable without duplicating profile content.
const authorRoute = 'authors/admin/';
await page(authorRoute, shell('About', `<div class="wrap inner-page"><p class="eyebrow">About</p><h1>${e(site.name)}</h1><p class="page-intro">${bio}</p>${link('Visit my homepage', '')}</div>`, { route: '', noindex: true }));
await writeFile(path.join(output, '404.html'), shell('Page not found', `<div class="wrap inner-page not-found"><p class="eyebrow">404</p><h1>A little <em>off the map.</em></h1><p>This page may have moved. You can find my latest research and contact details on the homepage.</p>${link('Back to the homepage', '', 'button')}</div>`, { noindex: true }));
await writeFile(path.join(output, '.nojekyll'), '');
await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', base).href}\n`);
await writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.filter(r => r !== authorRoute && r !== workRoute).map(r => `<url><loc>${e(new URL(r, base).href)}</loc><lastmod>${site.updated}</lastmod></url>`).join('')}</urlset>`);
const feed = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${e(site.name)} — Research</title><link>${e(base.href)}</link><description>${e(site.description)}</description>${[...site.publications].sort((a,b) => b.date.localeCompare(a.date)).map(p => `<item><title>${e(p.title)}</title><link>${e(new URL(`publications/${p.slug}/`, base).href)}</link><guid>${e(new URL(`publications/${p.slug}/`, base).href)}</guid><description>${e(p.summary)}</description><pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate></item>`).join('')}</channel></rss>`;
await writeFile(path.join(output, 'index.xml'), feed);
await writeFile(path.join(output, 'publications/index.xml'), feed);
console.log(`Built ${routes.length} pages for ${base.href} → public/`);
