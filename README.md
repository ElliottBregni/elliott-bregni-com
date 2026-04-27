# elliott-bregni-com

Personal site at [elliott.bregni.com](https://elliott.bregni.com) — Modernized AI LLC.

Astro 6 + Tailwind v4 + Markdown content collections. Served from GitHub Pages on push to `main`.

## Local

```bash
npm install
npm run dev      # http://localhost:4321
```

## Build

```bash
npm run build    # → dist/
npm run preview  # serves dist/ locally
```

## Structure

```
src/
├── components/     # Section components (Nav, Hero, About, Projects, ...)
├── content/        # Markdown content
│   └── blog/       # Blog posts (frontmatter: title, summary, date, tags)
├── layouts/        # BaseLayout.astro (head, fonts, body wrapper)
├── pages/          # Routes
│   ├── index.astro
│   └── blog/
│       ├── index.astro       # /blog — list of posts
│       └── [...slug].astro   # /blog/<slug>/ — individual post
├── scripts/        # Client-side TS (typewriter, scroll reveal, tilt cards)
├── styles/         # global.css (Tailwind + custom CSS)
└── content.config.ts
```

## Adding a blog post

Drop a `.md` file in `src/content/blog/`:

```markdown
---
title: "Your title"
summary: "One-line summary shown in the post list and OG tags."
date: 2026-04-27
tags: ["meta", "agents"]
draft: false
---

Content goes here. Standard Markdown — headings, lists, code, links.
```

The slug comes from the filename (`my-post.md` → `/blog/my-post/`). Set `draft: true` to keep a post out of builds.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and deploys to GitHub Pages.

## Custom domain

DNS for `elliott.bregni.com` should point at GitHub Pages:

- `A` records on the apex → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, **or**
- `CNAME` for `www` → `elliottbregni.github.io`

The `public/CNAME` file is what GitHub Pages reads to associate the domain with the repo.
