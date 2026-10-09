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

Live at `https://api.bioverbiometrics.com`, deployed 2026-10-09. These are
the steps that actually worked on this account — a few things differ from
generic Laravel-on-shared-hosting advice, noted below.

### Key gotcha: no docroot control, so the app lives outside the domain folder

This account's domain directory (`~/api.bioverbiometrics.com/`) is always
served as-is — there's no panel setting here to point it at a `public/`
subfolder of a deeper app directory. So instead of putting the whole app
under the domain folder, the layout is:

- `~/backup-api/` — the entire Laravel app (`app/`, `vendor/`, `.env`,
  `storage/`, everything) — **not** web-accessible.
- `~/api.bioverbiometrics.com/` — only `index.php`, `.htaccess`, and
  `robots.txt` copied from `backup-api/public/`, plus a `storage` symlink.
  `index.php`'s two `require` paths are rewritten from `__DIR__.'/../'` to
  `__DIR__.'/../backup-api/'` since it now lives one level further from the
  app than Laravel's default `public/index.php` assumes.

If your panel *does* let you set a custom web directory, pointing it at
`backup-api/public` directly is simpler and the stock `public/index.php`
needs no edits — this split-directory approach is only necessary when that
option isn't available.

### Key gotcha: `php` on the CLI is 8.2, but the app needs 8.3+

`composer.lock` (built locally) pinned dependencies requiring PHP ≥ 8.3.
The default `php` on this account's SSH is 8.2.30, which fails with a
platform_check.php fatal error. The fix: DreamHost keeps versioned binaries
at `/usr/local/php{56,70,...,85}/bin/php` — use
`/usr/local/php83/bin/php artisan ...` for every artisan command instead of
bare `php`. (The *web-serving* PHP version, set separately in the panel per
domain, was already 8.3+ here — only the SSH CLI default was behind.)

### Steps

1. **Database** — created via DreamHost panel → Databases → MySQL
   Databases, giving you a hostname, DB name, username, and password.

2. **Build production deps locally** (DreamHost's SSH has no Composer):
   ```bash
   cd backup-api
   composer install --no-dev --optimize-autoloader
   ```

3. **Package and upload everything except dev-only files**:
   ```bash
   tar czf /tmp/deploy.tar.gz \
     --exclude='tests' --exclude='.env' --exclude='database/database.sqlite' \
     --exclude='storage/app/public/entries' \
     app bootstrap config database public resources routes vendor \
     artisan composer.json composer.lock .env.example
   scp -P 22 /tmp/deploy.tar.gz user@host:~/backup-api-deploy.tar.gz
   ssh -p 22 user@host "mkdir -p ~/backup-api && tar xzf ~/backup-api-deploy.tar.gz -C ~/backup-api && rm ~/backup-api-deploy.tar.gz"
   ```
   `storage/` and `bootstrap/cache/` are gitignored (empty placeholders), so
   create them directly on the server instead of relying on the tarball:
   ```bash
   ssh -p 22 user@host "mkdir -p ~/backup-api/storage/app/public ~/backup-api/storage/app/private \
     ~/backup-api/storage/framework/cache/data ~/backup-api/storage/framework/cache/locks \
     ~/backup-api/storage/framework/sessions ~/backup-api/storage/framework/testing \
     ~/backup-api/storage/framework/views ~/backup-api/storage/logs ~/backup-api/bootstrap/cache \
     && chmod -R 775 ~/backup-api/storage ~/backup-api/bootstrap/cache"
   ```

4. **Write `.env` directly on the server** (don't upload your local one —
   compose a fresh production copy: real `APP_KEY` via
   `php artisan key:generate --show` run locally, a fresh
   `BACKUP_API_TOKEN` via `openssl rand -hex 32`, `APP_ENV=production`,
   `APP_DEBUG=false`, the DB credentials from step 1, and
   `CORS_ALLOWED_ORIGINS` set to the main app's real production URL). Then:
   ```bash
   scp -P 22 /tmp/prod.env user@host:~/backup-api/.env
   ssh -p 22 user@host "chmod 600 ~/backup-api/.env"
   ```

5. **Copy the public-facing files**, with `index.php`'s paths adjusted as
   described above, then symlink storage:
   ```bash
   scp -P 22 index.php .htaccess robots.txt user@host:~/api.bioverbiometrics.com/
   ssh -p 22 user@host "ln -sfn ~/backup-api/storage/app/public ~/api.bioverbiometrics.com/storage"
   ```

6. **Migrate**, using the versioned PHP binary:
   ```bash
   ssh -p 22 user@host "cd ~/backup-api && /usr/local/php83/bin/php artisan migrate --force"
   ```

7. **Verify** before wiring up the main app:
   ```bash
   curl https://api.bioverbiometrics.com/up
   curl -i -X POST https://api.bioverbiometrics.com/api/entries \
     -H "Authorization: Bearer <BACKUP_API_TOKEN>" -H "Content-Type: application/json" \
     -d '{"date":"2026-01-01","content":"<p>test</p>"}'
   ```
   Check `~/backup-api/storage/logs/laravel.log` for anything unexpected —
   no file at all means no errors were logged.

8. **Wire up the main app** — set `VITE_BACKUP_API_URL` and
   `VITE_BACKUP_API_TOKEN` as Vercel production env vars (the token needs
   `--type config` since any `VITE_`-prefixed var is inlined into the public
   bundle regardless of Vercel's secret/config distinction — there's no way
   around this for a pure static-frontend app with no server of its own; see
   `src/features/journal/backupApi.ts` for the accepted tradeoff), then
   redeploy.

9. **Backfill pre-existing entries** once, from the repo root:
   ```bash
   node --env-file=.env scripts/backfill-backup.mjs
   ```
   (needs `SUPABASE_SERVICE_ROLE_KEY` in `.env` temporarily — see that
   script's header comment for why the anon key won't work here.)

### Notes on shared hosting limits

- There's no persistent queue worker on shared plans — this app doesn't
  need one; `QUEUE_CONNECTION=sync` means the (rare, small) image download
  just happens inline during the request.
- DreamHost shared plans advertise unlimited disk space, which is the
  actual point of this backup — Cloudinary/Supabase's free tiers are
  capped, this isn't.
