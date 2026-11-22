# Portfolio

A Nuxt 4 portfolio with a built-in, password-protected admin. All content (profile, experience, stack, services, projects, FAQ, social links, images and the CV) is edited at `/admin` and stored locally in SQLite plus an uploads folder.

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

- Runs on Bun; listens on port 3000.
- The named volume `portfolio-data` (mounted at `/data`) holds the database and uploaded files, so rebuilds do not lose content. **Back up** by copying that volume.
- Put a reverse proxy with HTTPS (Caddy, nginx, Traefik) in front. The admin session cookie is `Secure` by default, so the admin only works over HTTPS (or set `COOKIE_SECURE=false` for local HTTP testing). Set `TRUST_PROXY=true` when the proxy sets `X-Forwarded-For` so login rate limiting sees real client IPs.

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `ADMIN_USERNAME` | yes | Admin username. The app will not start without it. |
| `ADMIN_PASSWORD` | yes | Admin password, at least 12 characters. |
| `SESSION_SECRET` | recommended | 32+ chars, signs the session cookie. If unset, a random one is used per start. |
| `SEED_PROFILE_EMAIL` | first run | Email shown on the site / used for `mailto:` links on first run. Editable later in the admin. |
| `TRUST_PROXY` | no | `true` behind your own reverse proxy. |
| `COOKIE_SECURE` | no | `false` only for plain-HTTP testing. |
| `DATA_DIR` | no | Data directory (default `./.data`, `/data` in Docker). |

## Admin

- Sign in at `/admin`. Edit any section and press **Save**; the public site updates immediately.
- **CV**: choose between an uploaded PDF or one generated live from your portfolio details. The home-page *Download CV* button serves `/cv` either way.
- Contact is a plain `mailto:` link to the profile email.
