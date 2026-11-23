# Portfolio

A Nuxt 4 portfolio with a kinetic, editorial look: pure black (dark) or pure white (light), huge type that changes weight as you scroll, and a home page made of full-screen sections you move sideways through. It has a project carousel, Pinterest-style staggered gallery and tech-stack animations, and a built-in password-protected admin. All content is edited at `/admin` and stored locally in SQLite plus an uploads folder. Built with [Nuxt UI](https://ui.nuxt.com) and Tailwind 4.

Pages: Home (horizontal sections), Work (project grid with details), Gallery (masonry, tag filter, lightbox), Services, Contact (`mailto:` link and FAQ).

**One layout on every screen.** The home page is a row of full-screen sections that lock into place; each scrolls vertically by itself when it has more content. This is the same on phone, tablet and desktop. Moving sideways works like turning a crown: a continuous gesture (trackpad swipe, Shift + scroll, or dragging a finger) is cut into ticks, one section per tick, so one long gesture can pass several sections, and a flick keeps spinning. Each tick gives haptic feedback where the device allows it: a short vibration on Android, a best-effort tap on iOS Safari 17.4+, and a double pulse at the first or last section. **Mac trackpads cannot be vibrated from a web page**, so there the footer progress line thickens briefly on each tick instead. Arrow keys, the footer links and the edge buttons step one section at a time. On phones the footer is a swipeable pager (drag along the dots to step through sections, with a tick and a vibration each), nothing scrolls sideways inside a section, and a chevron shows when a section continues below. Work and Gallery show every project and image (the full `/work` and `/gallery` views). The content of each section adapts to the viewport (a single column on phones, two-column Work rows and a vertical git rail on tablets, the SVG git tree and hover-expanding Services cards on desktop). Very short windows (under 560px high) and visitors who ask for reduced motion get the same sections as an ordinary vertical page.

Every section is always in the page in reading order, with a skip link and native focus handling. Controls on touch devices are at least 44px, and the footer respects the device safe area (`viewport-fit=cover`) and keeps the active section link in view.

**Image weight.** Uploads are optimised automatically: the EXIF rotation is applied, the image is scaled to at most 2000px (never enlarged), metadata such as GPS is removed, and it is stored as WebP (GIF, AVIF and PDF are kept as uploaded; anything that cannot be decoded or would not get smaller is kept as is). `bun scripts/optimize-images.mjs` does the same kind of shrinking for oversized files in `public/`, in place and safe to re-run.

## Develop

```bash
bun install
ADMIN_USERNAME=admin ADMIN_PASSWORD='a-long-passphrase' bun run dev   # http://localhost:3000, admin at /admin
bun test server                                                         # unit tests
```

The dev data lives in `./.data` (git-ignored). On first run the database is seeded from `server/lib/seed.ts`.

## Deploy with Docker Compose

```bash
cp deploy/.env.example deploy/.env      # then edit it
docker compose -f deploy/docker-compose.yml up -d --build
```

- Runs on Bun and listens on port 3000 **inside the container**. `docker-compose.yml` does not publish a port: attach your reverse proxy to the same Docker network, or add `ports: ["127.0.0.1:3000:3000"]` to the service.
- The named volume `portfolio-data` (mounted at `/data`) holds the database and uploaded files, so rebuilds do not lose content. **Back up** by copying that volume.
- Run it behind a reverse proxy with HTTPS (Caddy, nginx, Traefik). The admin session cookie is `Secure` by default, so the admin only works over HTTPS (set `COOKIE_SECURE=false` only for local HTTP testing).
- **Set `TRUST_PROXY=true`** and make the proxy set `X-Forwarded-For` itself (nginx: `proxy_set_header X-Forwarded-For $remote_addr;`). Login rate limiting keys on the last `X-Forwarded-For` entry; without a trusted proxy the Bun runtime cannot see client IPs, so all visitors would share one login-attempt bucket.
- **Limit request size at the proxy** (nginx: `client_max_body_size 12m;`). The app reads request bodies into memory before it can reject them.

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `ADMIN_USERNAME` | yes | Admin username. The app will not start without it. |
| `ADMIN_PASSWORD` | yes | Admin password, at least 12 characters. |
| `SESSION_SECRET` | recommended | 32+ chars, signs the session cookie. If unset, a random one is used per start. |
| `NUXT_PUBLIC_SITE_URL` | recommended | Public URL of the site, used for canonical links, the sitemap, `llms.txt` and JSON-LD. |
| `SEED_PROFILE_EMAIL` | first run | Email shown on the site / used for `mailto:` links on first run. Editable later in the admin. |
| `TRUST_PROXY` | yes in production | `true` when behind your reverse proxy (see above). |
| `COOKIE_SECURE` | no | `false` only for plain-HTTP testing. |
| `DATA_DIR` | no | Data directory (default `./.data`, `/data` in Docker). |

## Admin

- Sign in at `/admin`. Edit any section and press **Save**; the public site updates immediately.
- Sections: Profile (including phone and location, used on the CV), Counters, Experience, Stack, Services, Service plans, Projects (tags, cover and extra screenshots), Gallery, Education, FAQ, Social links, CV.
- **Images**: upload from any image field (PNG, JPEG, WebP, AVIF, GIF, up to 5 MB).
- **CV**: choose between an uploaded PDF and one generated live from your details. The generated CV is ATS-friendly: a single column of plain text with the standard headings Summary, Experience, Skills, Education and Projects, and one bullet per line of each description (a long paragraph is split into sentences). Fill in Education, phone and location for a complete CV. The home-page *Download CV* button serves `/cv` either way.
- Contact is a plain `mailto:` link to the profile email.
- **Passkeys**: once signed in with the password, open the **Security** tab and press *Add a passkey* to register a fingerprint, face unlock, device PIN or security key (give it a name to tell devices apart; remove one any time). The login page then offers *Sign in with a passkey*. The password keeps working as a fallback. A passkey only works on the host it was created on: set `NUXT_PUBLIC_SITE_URL` to your public `https://` address in production (behind a proxy it is used as the passkey origin), and register passkeys from that address, not from `localhost`. Passkeys are stored (public key only) in the same SQLite database, so they live on the data volume.
