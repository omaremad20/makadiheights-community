# Security model

The portal is a public, **read-only** information site. There is no sign-in, no admin panel,
no API route and no server action. Visitors can only read.

## Database (`public` schema)

Applied by `supabase/migrations/20261028190000_portal_schema.sql`:

- Row Level Security is **enabled on every portal table**.
- Table privileges for `anon` and `authenticated` were **revoked** and replaced with **`SELECT` only**
  (Supabase's default grants would otherwise include `INSERT/UPDATE/DELETE/TRUNCATE`).
- Each table has exactly one policy: `FOR SELECT TO anon, authenticated` (published rows only where an
  `is_published` column exists). There are no insert/update/delete policies.
- Identity sequences: all privileges revoked from `anon`/`authenticated`.
- Default privileges for new objects created by `postgres` in `public` no longer grant anything to
  `anon`/`authenticated`. **When you add a new table, grant `SELECT` and add a read policy yourself.**
- No views, functions or RPC endpoints exist in `public`, so nothing can bypass RLS.
- The owner manages data in the Supabase Dashboard as `postgres`/`service_role`, which bypass RLS.

## Storage (bucket `makadiheights-data`)

Unchanged — it was already correct:

- The bucket is **public**, so the original documents download without a key.
- The only policy on `storage.objects` is `"Anyone can read pdfs"` — `SELECT` for bucket `makadiheights-data`.
- There are **no** `INSERT`, `UPDATE` or `DELETE` policies, so uploads, overwrites, deletes and folder
  creation are denied for `anon` and `authenticated`. Creating buckets is denied too.
- Note: the SELECT policy also lets anyone *list* the bucket's file names. That is acceptable because every
  file is public. If you ever add private files, put them in a separate **private** bucket.

## Keys

- The app only uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- No service-role or secret key is referenced anywhere in the code. `.env*` files are git-ignored
  (except `.env.example`, which contains placeholders only).

## Online forms

Form answers stay in the visitor's browser memory. The PDF is generated client-side with `pdf-lib` from a
static template; no request carries form data, nothing is written to localStorage/sessionStorage/cookies,
and nothing is stored in Supabase. "Clear form" and leaving the page discard the data.

## Verification

Performed on 2026-10-28 directly in the database (`SET ROLE anon` / `SET ROLE authenticated`):

| Check | Result |
| --- | --- |
| anon / authenticated `SELECT` on portal tables | ✓ allowed (e.g. 33 businesses, 24 prices) |
| anon/authenticated `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE` on portal tables | ✓ denied (`42501`) |
| anon/authenticated `INSERT` into `storage.objects` (upload) | ✓ denied (`42501`) |
| anon `UPDATE` on `storage.objects` (overwrite/rename) | ✓ 0 rows affected |
| anon `DELETE` on `storage.objects` | ✓ denied |
| anon `INSERT`/`UPDATE` on `storage.buckets` | ✓ denied / 0 rows |
| Supabase security advisor | ✓ no findings |

To repeat the checks over the real HTTP APIs with the publishable key (recommended after any policy change):

```bash
node --env-file=.env.local scripts/verify-readonly.mjs
```
