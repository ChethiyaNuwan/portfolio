# Portfolio admin CMS — design

## Intent
Turn the static Nuxt 4 portfolio into a content-managed site. The owner edits all content (profile, experience, stack, services, projects, FAQ, socials, images, CV) from a secured admin, and deploys with Docker Compose on Bun.

## Goals
- Admin UI at `/admin` to create/edit/delete all content currently in `app/data/index.ts`.
- Single admin account; credentials from server env (`ADMIN_USERNAME`, `ADMIN_PASSWORD`).
- Local persistence: SQLite (`bun:sqlite`) + `uploads/` dir, both in one Docker volume.
- CV: admin toggle between **uploaded PDF** and **generated PDF** (from portfolio data, via `pdf-lib`). Public "Download CV" serves whichever is active.
- Contact: remove Resend and `/api/contact`; replace with `mailto:` button. FAQ stays.
- `deploy/` folder: Dockerfile (Bun, Nitro `bun` preset) + docker-compose.yml with volume + env file.

## Non-goals
Multi-user/roles, i18n, external object storage, built-in HTTPS (reverse proxy handles it), headless-browser PDF rendering.

## Anti-goals
Public pages showing empty content on first load; admin reachable without auth; secrets in client bundle or repo; losing data on container rebuild.

## Constraints
Existing UI/look must be preserved. Public pages SSR their data from the DB. Seed DB from current content on first run.

## Approaches considered
1. **SQLite + uploads volume (chosen)** — safe concurrent writes, simple backup, one volume.
2. JSON file store — simpler, but racy writes and no constraints.
3. External CMS (Strapi/Directus) — against "local storage, simple compose".
CV: `pdf-lib` server-side (chosen, light, no browser) vs headless Chromium (heavy image).

## Design
- **Data:** tables per content type (`profile` singleton, `counters`, `experience`, `stack`, `services`, `service_plans`, `projects`, `faq`, `socials`, `settings` for CV mode). Seed from current data when DB empty. Public `GET` via server utils used by pages (`useAsyncData`/`useFetch` to `/api/content`).
- **Auth:** env creds validated at startup (refuse to boot if missing or password < 12 chars). Password hashed at startup (`Bun.password`), constant-time username compare. Login → sealed httpOnly SameSite=Strict (+Secure in prod) session cookie via h3 `useSession`. Rate limit + lockout on login, CSRF token header on all admin writes, `X-Frame-Options`/CSP/nosniff headers, `noindex` on admin. Middleware guards `/api/admin/**` and `/admin/**`.
- **Uploads:** admin-only; allow-list image types + PDF; size cap; sniff magic bytes; random filenames; served from `/uploads/**` with safe headers.
- **CV:** `settings.cv_mode = 'uploaded' | 'generated'`; `GET /cv` streams the active PDF (generated on demand, cached until content changes).
- **Admin UI:** Nuxt pages under `/admin` (login, dashboard sections with forms/lists, image/CV upload), no layout shell of the public site.
- **Deploy:** `deploy/Dockerfile`, `deploy/docker-compose.yml`, `deploy/.env.example`; volume mounted at `/data`; non-root user; healthcheck.

## Left to the builder
Exact table columns, form layout, PDF styling, rate-limit thresholds, ordering/drag-reorder UX (simple up/down acceptable).
