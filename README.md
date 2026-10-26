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
| `data/site.json` | Bio, contact, research, news, education, publications, awards, service |
| `static/images/portrait.jpg` | Existing portrait |
| `static/uploads/resume.pdf` | Current CV; October 2026 version |
| `static/publications/*/cite.bib` | Downloadable citations |
| `static/styles.css` | Layout, typography, responsive and print styles |
| `scripts/build.mjs` | Page templates, metadata, sitemap, RSS |

To add a publication, add an entry to `publications` in JSON and its BibTeX file. Use `type: "published"` only for confirmed peer-reviewed publications, and `"preprint"` otherwise. Update the `updated` date when changing content. Replace the PDF and `cvDate` together when a newer CV is ready.

## Content and migration notes · October 2026

- Updated to first-year Northwestern MTS Ph.D. student; RUC education marked complete.
- The LL.B. degree label and institutional email follow the CV in the original repository.
- CSCW and CIKM titles/authors follow the original BibTeX. The Social Worldview preprint follows [arXiv v2](https://arxiv.org/abs/2505.01967), revised December 29, 2025; it is not presented as an accepted paper.
- The crisis-amplification study remains a working paper. No new acceptance, advisor relationship, or unpublished result is inferred.
- The CV was replaced on October 25, 2026 with the supplied two-page PDF and is dated on the Experience page.
- Hugo Blox configuration, demo blog/course/project content, the Figma embed, duplicated publication sections, and template workflows were retired. Previous source remains in Git history.
- Existing home, experience, publication, author-profile, CV, citation, and research-feed URLs are preserved. Placeholder demo pages are removed.
- No third-party analytics, webfonts, or embedded frames are loaded.

## Accessibility

Semantic landmarks, skip navigation, visible keyboard focus, native citation disclosure, responsive layouts, reduced-motion support, descriptive portrait text, custom 404, and print styles are included. Citation copying has a manual fallback when clipboard permission is unavailable.

## Verification for this revision

The production build and internal-link checks passed at both `/yanhengli/` and `/`, covering nine HTML files and 144 internal links. JavaScript syntax and whitespace checks passed. The CV replacement preserves the supplied PDF byte-for-byte.

This editing session could not start a preview server or access local HTML through the browser because of environment security restrictions. Desktop/mobile visual review and the GitHub-hosted Actions run remain to be verified. Run `npm run dev` locally to review the design before publishing.
