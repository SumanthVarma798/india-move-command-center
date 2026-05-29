# India Move Command Center

A polished shared Supabase-backed React dashboard for the permanent move from the US to India on June 21, 2026.

This site is for status, checklists, reminders, and links only. Do not store passport scans, SSNs, account numbers, recovery codes, passwords, or private documents in this repo or in the browser data. Actual files stay in Google Drive. Secrets stay in a password manager.

## Local Setup

```bash
npm install
npm run dev
```

Supabase sync is configured through Vite environment variables. The public project URL and publishable key are safe for browser use, while direct database connection strings and service-role keys must never be committed.

```bash
cp .env.example .env.local
```

## Build

```bash
npm run build
```

## Deploy to GitHub Pages

Deployment uses GitHub Actions in `.github/workflows/deploy.yml`.

1. Push the repo to GitHub.
2. In GitHub, open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main` or run the workflow manually.

The Vite base path is computed from `GITHUB_REPOSITORY` during the Pages build, so it will use the repository name automatically.

## Updating Data

Initial seed data lives in `src/data/initialData.ts`. The app uses a shared password and stores dashboard state in one shared Supabase JSON row. It does not persist task progress in browser `localStorage`; the shared password is remembered in tab-scoped `sessionStorage` so reloads in the same tab are simple.

To change the default data for everyone, edit `src/data/initialData.ts` and redeploy. To change only your current browser state, use the dashboard controls.

## Supabase Setup

Run the SQL migrations in `supabase/migrations/` against the Supabase project. The current app uses `shared_dashboard_state` plus RPC functions that validate the shared password before reading or writing the tracker.

Rotate it in Supabase SQL with:

```sql
update public.shared_dashboard_state
set password_hash = extensions.crypt('NEW_PASSWORD_HERE', extensions.gen_salt('bf'))
where id = 'main';
```

Email Auth is not required for the shared-password version. If you re-enable Supabase Auth later, add the GitHub Pages URL to allowed redirect URLs:

```text
https://sumanthvarma798.github.io/india-move-command-center/
```

## Export / Import Backup

Use **Export JSON** to download a backup of the dashboard state. Use **Import JSON** to restore that backup into your signed-in Supabase dashboard.

The backup may contain notes you type into the dashboard later, so keep exports private and avoid adding sensitive data.
