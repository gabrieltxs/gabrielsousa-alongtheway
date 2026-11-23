# Instructions for coding agents

This repository is Gabriel Sousa's personal site and research blog, built with Astro and published on GitHub Pages.

- **To publish or deploy the site**, follow `docs/PUBLICAR-COM-AGENTE.md` step by step (written in Portuguese).
- **Do not edit content** (`src/content/`, `src/data/`, `public/`) unless the user asks for a specific change.
- Before any push: `npm ci && npm test && npm run build` must pass.
- Never force-push, never commit `node_modules/`, `dist/`, `.astro/` or `.env*`.
- All website copy is in English; documentation in `docs/` is in Portuguese.

- Load publication credentials only through `scripts/publish-env.mjs` and `.env.publish`; never print the file, token, environment dumps, or credential-helper output. A token in a local file is explicitly requested by the user.
- The current task prepares publication only. Execute remote creation/push/deployment when the user subsequently instructs you to publish.
