# journal backup-api

A small Laravel app that mirrors journal entries (text + one photo each) from
the main app into a second, independent store on DreamHost — so neither
Supabase's nor Cloudinary's free-tier limits are the only copy of your data.

The main app writes here directly over HTTPS on every explicit Save (not
every autosave tick) and every delete. It's best-effort: if this API is
slow, unreachable, or unconfigured, the main app's save still succeeds —
this is purely a backup, never a dependency.

## How it works

- `POST /api/entries` — upserts an entry by `date`. If `image_url` is given
  (a Cloudinary URL) and it's new, the controller downloads it server-side
  and stores a local copy under `storage/app/public`.
- `DELETE /api/entries/{date}` — soft-deletes (sets `deleted_at`). Rows are
  never hard-deleted, so an accidental delete in the main app doesn't erase
  the backup's only copy. Saving the same date again un-deletes it.
- Every request requires `Authorization: Bearer <BACKUP_API_TOKEN>`,
  checked in `app/Http/Middleware/VerifyBackupToken.php`.

## Local development

```bash
composer install
cp .env.example .env
php artisan key:generate
# Point DB_* in .env at a local MySQL database, then:
php artisan migrate
php artisan storage:link
php artisan serve --port=8123
```

Set `VITE_BACKUP_API_URL=http://127.0.0.1:8123` and
`VITE_BACKUP_API_TOKEN=<same token as .env>` in the main app's `.env` to
exercise the full flow locally.

## Deploying to DreamHost (shared hosting)

These are the standard steps for DreamHost's shared plans — adjust if your
panel looks different.

### 1. Create the database

DreamHost panel → **Databases → MySQL Databases** → create a new database.
Note the **hostname**, **database name**, **username**, and **password** it
gives you — you'll need all four.

### 2. Point a (sub)domain at this app

DreamHost panel → **Domains → Manage Domains** → add/edit the domain or
subdomain you want this on (e.g. `backup.yourdomain.com`). Under its web
directory settings, you'll eventually point it at this app's `public/`
folder (step 4) — a plain Laravel app can't be served from its repo root.

Also set the domain's **PHP version to 8.2 or newer** in the same panel
(this app needs PHP ≥ 8.2).

### 3. Upload the code

Over SSH (panel → **Users → Manage Users** → enable shell access if you
haven't already):

```bash
ssh your_user@yourdomain.com
cd ~/yourdomain.com   # or wherever the domain's directory is
git clone <your repo url> backup-api
# or: upload via SFTP/rsync if you'd rather not put the repo on the server
```

If Composer isn't already available over SSH, DreamHost has docs for
installing it per-account — see
https://help.dreamhost.com/hc/en-us/articles/115000702202.

```bash
cd backup-api
composer install --no-dev --optimize-autoloader
```

### 4. Point the domain's web directory at `public/`

Back in **Manage Domains**, set this domain/subdomain's web directory to
`backup-api/public` (the path you cloned into, plus `/public`). This is the
part that makes a bare domain folder serve Laravel correctly instead of
exposing the whole app source.

### 5. Configure the app

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env`:
- `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` — from step 1.
- `BACKUP_API_TOKEN` — generate one with `openssl rand -hex 32`. You'll
  reuse this exact value as `VITE_BACKUP_API_TOKEN` in the main app.
- `CORS_ALLOWED_ORIGINS` — the main app's production URL, e.g.
  `https://journal-beryl-psi.vercel.app`.
- `CORS_ALLOWED_ORIGIN_PATTERNS` — leave the default; it matches Vercel's
  per-deploy preview URLs for this project.
- `APP_URL` — `https://backup.yourdomain.com` (your actual domain).
- `APP_ENV=production`, `APP_DEBUG=false`.

### 6. Migrate and link storage

```bash
php artisan migrate --force
php artisan storage:link
```

### 7. Wire up the main app

In Vercel's project settings (or the main app's `.env` for local dev), set:

```
VITE_BACKUP_API_URL=https://backup.yourdomain.com
VITE_BACKUP_API_TOKEN=<the same BACKUP_API_TOKEN from step 5>
```

Redeploy the main app. Save a journal entry and check
`storage/logs/laravel.log` here (or the `journal_entries` table) to confirm
it arrived.

### Notes on shared hosting limits

- There's no persistent queue worker on shared plans — this app doesn't
  need one; `QUEUE_CONNECTION=sync` means the (rare, small) image download
  just happens inline during the request.
- DreamHost shared plans advertise unlimited disk space, which is the
  actual point of this backup — Cloudinary/Supabase's free tiers are
  capped, this isn't.
