# Yanheng Li · academic website

A responsive academic website for **https://chrisleeyh.github.io/yanhengli/**. Warm ivory, muted purple, serif typography, and concise editorial layouts. All pages are static HTML; JavaScript only enhances citation copying.

## Preview

Requires **Node.js 22 or later**. No packages to install.

```sh
npm run dev
```

Open **http://127.0.0.1:4173/yanhengli/**. Source changes rebuild automatically; refresh the browser to see them. The preview uses the same `/yanhengli/` prefix as GitHub Pages. Set `PORT=4174` if necessary.

## Build and check

```sh
npm run build
npm run check
```

Output is in `public/`, which is ignored by Git. Checks cover internal links, fragments, assets, preserved URLs, and essential metadata. For a custom domain or another repository path:

```sh
npm run build -- --base-url https://example.org/
npm run check
```

## Deploy to the original GitHub Pages site

1. Keep the existing repository: `ChrisLeeYH/yanhengli`.
2. In **Settings → Pages → Build and deployment**, use **GitHub Actions** (the existing workflow also used this setting).
3. Merge or push the changes to `main`. `.github/workflows/deploy.yml` builds, checks, uploads, and deploys `public/`. Pull requests build and validate without publishing.
4. Check the **Deploy website to GitHub Pages** action. The URL remains **https://chrisleeyh.github.io/yanhengli/** unless a custom domain is configured.

The workflow reads the URL from GitHub Pages, so assets and navigation support project URLs and custom domains. No Hugo, Go, Tailwind, npm dependencies, or external fonts are needed. GitHub still downloads its standard checkout/setup/deployment Actions.

## Update content

| File | Purpose |
| --- | --- |
| `data/site.json` | Bio, contact, interests, news, education, publications, working papers, projects, grants, awards, conferences, service, skills |
| `static/images/portrait.jpg` | Existing portrait |
| `static/uploads/resume.pdf` | Current CV; November 2026 version |
| `static/publications/*/cite.bib` | Downloadable citations |
| `static/styles.css` | Layout, typography, responsive and print styles |
| `scripts/build.mjs` | Page templates, metadata, sitemap, RSS |

The supplied November 2026 CV is the source for current profile facts and research status. Keep primary and secondary interests distinct. Add peer-reviewed publications and linked preprints to `publications` with their BibTeX files; use `type: "published"` only for confirmed peer-reviewed work and `"preprint"` for preprints. Add other manuscripts to `workingPapers` and selected ongoing projects to `worksInProgress`. Use “Under review” only where the CV states it. Update `updated` when content changes, and replace the PDF and `cvDate` together when a newer CV is ready.

## Content and migration notes · November 2026

- The bio, primary contact email, education, interests, grants, honors, conferences, service, and skills follow the November 2026 CV. Existing portrait, social links, and personal interests are retained.
- Northwestern’s Ph.D. dates are 2026–2031 (expected); the Renmin degree is LL.B. in Politics, Economics and Philosophy (PPE).
- CSCW and CIKM titles/authors follow the original BibTeX. The Social Worldview preprint follows [arXiv v2](https://arxiv.org/abs/2505.01967), revised December 29, 2025; it is not presented as an accepted paper.
- Research lists distinguish two peer-reviewed publications, four working papers (including the arXiv preprint), and two selected works in progress. Only the two crisis manuscripts are labeled under review.
- The original `publications/crisis-paper-submission/` URL links visitors to the current working papers. It is not treated as a title change for any particular manuscript. Old research-experience descriptions absent from the latest CV are no longer presented as current projects.
- The CV was replaced on November 27, 2026 with the supplied two-page PDF and is dated on the Experience page.
- Hugo Blox configuration, demo blog/course/project content, the Figma embed, duplicated publication sections, and template workflows were retired. Previous source remains in Git history.
- Existing home, experience, publication, author-profile, CV, citation, and research-feed URLs are preserved. Placeholder demo pages are removed.
- No third-party analytics, webfonts, or embedded frames are loaded.

## Accessibility

Semantic landmarks, skip navigation, visible keyboard focus, native citation disclosure, responsive layouts, reduced-motion support, descriptive portrait text, custom 404, and print styles are included. Citation copying has a manual fallback when clipboard permission is unavailable.

## Verification

Run `npm run build` and `npm run check` before publishing. Check both the default `/yanhengli/` base path and a root-domain build when changing routing. Use `node --check scripts/build.mjs` and `git diff --check` for syntax and whitespace checks. Keep the supplied CV PDF unchanged.

Review the homepage, publications, and experience pages at desktop and mobile widths. After publishing, confirm the GitHub Actions deployment succeeds and the public pages and CV download are accessible without sign-in.
