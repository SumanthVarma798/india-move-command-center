# India Move Command Center

A polished local-first React dashboard for the permanent move from the US to India on June 21, 2026.

This site is for status, checklists, reminders, and links only. Do not store passport scans, SSNs, account numbers, recovery codes, passwords, or private documents in this repo or in the browser data. Actual files stay in Google Drive. Secrets stay in a password manager.

## Local Setup

```bash
npm install
npm run dev
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

Initial seed data lives in `src/data/initialData.ts`. Browser changes are saved to `localStorage`, so daily progress stays on the device where you use the dashboard.

To change the default data for everyone, edit `src/data/initialData.ts` and redeploy. To change only your current browser state, use the dashboard controls.

## Export / Import Backup

Use **Export JSON** to download a local backup of the dashboard state. Use **Import JSON** to restore that backup in another browser.

The backup may contain notes you type into the dashboard later, so keep exports private and avoid adding sensitive data.
