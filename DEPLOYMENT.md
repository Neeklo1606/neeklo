# Deployment Guide — Neeklo

This project has two frontends:

- **React SPA** (main site): `/`, `/services`, `/work`, `/about`, `/contact`, etc.
- **Admin Panel** (Vue): `/admin`, `/admin/*` — login, cases, users, media, etc.

Both must be built before deploy. Backend is Laravel (API + Blade views for admin and SPA shell).

---

## 1. Local development

### One-command (recommended)

```bash
cp .env.example .env
php artisan key:generate
# DB: use sqlite or set DB_* in .env

# Optional: VITE_DEV_SERVER_URL=http://localhost:8080 in .env

npm install
cd frontend && npm install && cd ..

npm run dev:local
```

- Laravel: http://127.0.0.1:8000  
- React (Vite): http://localhost:8080 (proxies /admin, /api, /storage, /build to 8000)

### Two terminals

**Terminal 1 — Laravel**

```bash
php artisan serve
```

**Terminal 2 — React dev server**

```bash
cd frontend && npm run dev
```

Set in `.env`: `VITE_DEV_SERVER_URL=http://localhost:8080`  
Then open http://localhost:8080 for the site and http://localhost:8080/admin for the admin panel.

### Local with production builds (no Vite)

```bash
php artisan serve
# In another shell:
npm run build:all
# Open http://127.0.0.1:8000 and http://127.0.0.1:8000/admin
```

---

## 2. Build for production

```bash
composer install --no-dev --optimize-autoloader
npm ci
npm run build          # Vue admin → public/build/
cd frontend && npm ci && npm run build   # React → public/frontend/
```

Or from repo root:

```bash
npm run build:all
```

Required artifacts:

- `public/build/` — Admin (Vue) assets and manifest
- `public/frontend/` — React app (index.html, assets/)

---

## 3. Server requirements

- PHP 8.2+ (8.4 preferred)
- Composer 2
- Node.js 18+ (for build only)
- MySQL/PostgreSQL or SQLite
- Web server (Nginx/Apache) with docroot = `public/`

---

## 4. Deploy steps (manual)

1. Clone and enter project:
   ```bash
   git clone <repo> && cd neeklo
   ```

2. Environment:
   ```bash
   cp .env.example .env
   php artisan key:generate
   # Edit .env: APP_URL, DB_*, SANCTUM_STATEFUL_DOMAINS
   ```

3. Dependencies and build:
   ```bash
   composer install --no-dev --optimize-autoloader
   npm ci && npm run build
   cd frontend && npm ci && npm run build
   ```

4. Laravel:
   ```bash
   php artisan migrate --force
   php artisan db:seed --force   # Creates CMS pages (home, services, etc.). Without this, /api/v1/pages/home returns 404.
   php artisan config:cache
   php artisan route:cache
   php artisan storage:link
   ```

5. Point the web server document root to `public/`.  
   Ensure `/admin` and `/api` are handled by Laravel (no static overrides).

---

## 5. GitHub Actions

- **CI** (`.github/workflows/ci.yml`): on push/PR to `main`/`develop` — install deps, build Admin + React, run migrations. Use to verify all builds and routes.
- **Deploy** (`.github/workflows/deploy.yml`): on push to `main` — builds Admin + React and uploads artifacts. Optional SSH deploy:
  - Repo variable: `DEPLOY_ENABLED = true`
  - Secrets: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, optionally `DEPLOY_PATH`

---

## 6. Environment variables (production)

| Variable | Required | Description |
|----------|----------|-------------|
| `APP_ENV` | Yes | `production` |
| `APP_DEBUG` | Yes | `false` |
| `APP_URL` | Yes | Root URL, e.g. `https://neeklo.studio` |
| `DB_*` | Yes | Database connection |
| `SANCTUM_STATEFUL_DOMAINS` | If SPA on same domain | e.g. `neeklo.studio` |
| `VITE_DEV_SERVER_URL` | No in prod | Only for local React dev |

---

## 7. Pages and routes (reference)

- **React**: `/`, `/services`, `/work`, `/work/:slug`, `/about`, `/contact`, `/process`, `/blog`, `/blog/:slug`, `/privacy`, `/terms`, `/docs`, `/documentation`, `/cases`, product pages under `/products/*`.
- **Admin**: `/admin`, `/admin/login`, `/admin/register`, `/admin/cases`, etc. (all `/admin` and `/admin/*` serve the same Blade view that loads the Vue app).

All non-asset requests not matched by Laravel (e.g. `/some-seo-page`) are passed to the React SPA via the catch-all route so the client router can handle them.
