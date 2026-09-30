# Journal

A personal timeline for journaling and tracking what you're pursuing. React + Vite + TypeScript + Tailwind + Supabase.

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Create a Supabase project (or use `supabase start` locally if you have Docker installed).

3. Apply the schema in `supabase/migrations/` — either:

   - `supabase link --project-ref <your-project-ref>` then `supabase db push`, or
   - paste the contents of the migration file into the Supabase Dashboard's SQL Editor and run it.

4. Copy `.env.example` to `.env` and fill in your project's URL and anon key (Dashboard → Project Settings → API):

   ```
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=
   ```

5. Create your user account: Dashboard → Authentication → Users → **Add user** (check "Auto Confirm User"). This app is single-user — there's no sign-up flow.

6. Run the dev server:

   ```
   npm run dev
   ```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — typecheck and build for production
- `npm run lint` — run oxlint
- `npm run preview` — preview the production build locally

## Notes

- `src/types/database.ts` is hand-written to match the migration. Regenerate it from a live database with `supabase gen types typescript --local > src/types/database.ts` if the schema changes.
- Row Level Security allows any authenticated session to manage all rows — appropriate for this single-user app. See the migration file for details.
