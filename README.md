# Amogh Skanda Suresh's portfolio

A static Astro portfolio for ML, computer vision, multimodal AI, agentic systems, software engineering, and data science internship opportunities.

Configured public address: **https://amoghskanda.github.io/**

## Run locally

Use Node.js 24, as specified in `.nvmrc`.

```sh
npm ci
npm run dev
```

Astro prints the local development URL. To check the production output:

```sh
npm run check
npm run build
npm run preview
```

The production preview runs at `http://127.0.0.1:4174`.

## Edit content

| Content | Location |
| --- | --- |
| Contact details and profile information | `src/data/profile.ts` |
| The five workflow diagrams and inspector text | `src/data/projects.ts` |
| Internship workflow text | `src/data/internships.ts` |
| Full-time case studies, tracker, public projects, education/timeline | `src/data/content.ts` |
| Internship introduction and media captions | `src/components/InternshipSection.astro` |
| Research introduction and recovery demonstration | `src/components/RecoveryLab.astro`, `src/scripts/recovery.js` |
| Visual styling | `src/styles/site.css`, `src/styles/recovery.css` |
| Images and other public files | `public/` |

Content can also be revised through the existing Codex chat. The changes still need to be committed and pushed to publish.

## Publish updates

The `main` branch deploys through `.github/workflows/deploy.yml`. It checks and builds the site before GitHub Pages publishes the static `dist/` output. No application server, database, API key, or paid service is required.

After editing:

```sh
npm run check
npm run build
git add src public
git commit -m "Update portfolio content"
git push origin main
```

Follow the deployment under the repository's **Actions** tab. The workflow can also be started manually. The repository's **Settings → Pages → Source** must be **GitHub Actions**.

For a custom domain later, update `site` in `astro.config.mjs`, `siteUrl` in `src/data/profile.ts`, `public/robots.txt`, `public/sitemap.xml`, and the domain's DNS. GitHub's default address is sufficient for internship applications.

## Content and references

Professional work is described through conceptual workflows. The recovery lab runs deterministic synthetic examples, and the real-model evaluation project remains in research and design. The internship tracker remains in progress.

Published research images and public tool demonstrations are explicitly attributed. See [THIRD_PARTY.md](THIRD_PARTY.md) for their sources and the copied FiftyOne license.

Private research notes, resume archives, credentials, and local data are not part of the published site. `.scratch/`, environment files, dependencies, build output, and the local prototype directory are ignored by Git. The approved prototype is archived on the local `prototype-exploration` branch and is not needed for production deployment.
