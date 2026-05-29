# India Move Command Center

A polished Supabase-backed React dashboard for the permanent move from the US to India on June 21, 2026.

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

Initial seed data lives in `src/data/initialData.ts`. The app requires email sign-in and stores dashboard state in Supabase, one JSON row per authenticated user. It does not persist task progress in browser `localStorage`; Supabase Auth uses tab-scoped `sessionStorage` for the sign-in session.

To change the default data for everyone, edit `src/data/initialData.ts` and redeploy. To change only your current browser state, use the dashboard controls.

## Supabase Setup

Run the SQL migration in `supabase/migrations/` against the Supabase project. It creates a `dashboard_states` table with row-level security so each signed-in user can only read and write their own dashboard state.

In Supabase Auth settings, add the GitHub Pages URL to allowed redirect URLs:

```text
https://sumanthvarma798.github.io/india-move-command-center/
```

## Export / Import Backup

Use **Export JSON** to download a backup of the dashboard state. Use **Import JSON** to restore that backup into your signed-in Supabase dashboard.

The backup may contain notes you type into the dashboard later, so keep exports private and avoid adding sensitive data.
