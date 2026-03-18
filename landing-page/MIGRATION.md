# Migration Guide: Static Landing → Next.js

This document maps your existing `vibecodetest1/` files to the Next.js project structure.

---

## File Mapping

| Your File | Next.js Location | Notes |
|-----------|------------------|-------|
| `index.html` | `app/layout.js` + `app/page.js` | Layout holds `<html>`, metadata, body structure. Page holds main content. |
| `styles.css` | `app/globals.css` | Global CSS. Already copied. |
| `main.js` | `lib/landing-config.js` + `app/page.js` | Config: projects + logo only. Grid styling in `globals.css`. |
| `logo-viewer.js` | `components/LogoViewer.js` | Must run client-side (`'use client'`). Uses Three.js (browser-only). |
| `project-grid.js` | `components/ProjectGrid.js` | Same — client component with DOM/event logic. |
| `web/*` (images, videos, STL) | `public/web/*` | Static assets in `public/` are served at `/web/...`. |

---

## Directory Structure

```
landing-page/
├── app/
│   ├── layout.js       ← Replaces <html>/<head>/<body> from index.html
│   ├── page.js         ← Home page (replaces main content)
│   └── globals.css     ← Your styles.css content
├── components/
│   ├── LogoViewer.js   ← From logo-viewer.js (client component)
│   └── ProjectGrid.js  ← From project-grid.js (client component)
├── lib/
│   └── landing-config.js  ← logo + grid config from main.js
├── public/
│   └── web/            ← Copy vibecodetest1/web/ here
├── package.json
├── next.config.js
└── jsconfig.json
```

---

## What to Copy

1. **`vibecodetest1/web/`** → **`landing-page/public/web/`**
   - All images, videos, STL files
   - They will be reachable at `/web/logo_web/logo_web.stl`, etc.

2. **Video files** (if you have `/videos/`):
   - Put them in `public/videos/` (e.g. `public/videos/b.mp4`)

---

## Next Steps (Component Migration)

Your `LogoViewer` and `ProjectGrid` are vanilla JS classes that use `document.createElement`, `addEventListener`, etc. In Next.js you have two options:

### Option A: Use them via ref + useEffect (fastest)

- Render a `<div ref={containerRef} />` in each component
- In `useEffect`, instantiate `new LogoViewer(containerRef.current, options)` (and similar for ProjectGrid)
- Dynamically import them with `next/dynamic` and `{ ssr: false }` so Three.js and DOM APIs only run in the browser

### Option B: Rewrite as React components

- Replace DOM creation with JSX
- Replace `addEventListener` with React event handlers
- Use `useEffect` for Three.js setup and cleanup

---

## Running the Project

```bash
cd landing-page
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
