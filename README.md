# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Backend Token Refresh (Manual Workflow)

This project supports DB-backed Instagram token refresh in `server/`.

### Environment variables (`server/.env` for local, Render env vars in production)

- `CLIENT_TOKEN` (bootstrap fallback token)
- `IG_REFRESH_INTERVAL_DAYS` (default refresh cadence)
- `DATABASE_URL` (Render Postgres connection string)
- `PORT` and `BASE_URL` (optional local/runtime config)

### Create token table

```sql
CREATE TABLE IF NOT EXISTS instagram_token_state (
	id TEXT PRIMARY KEY,
	client_token TEXT NOT NULL,
	last_refresh BIGINT NOT NULL
);
```

### Run refresh job locally

```bash
cd server
npm run refresh:token
```

### Refresh job command

Use this whenever you want to refresh the Instagram token manually:

```bash
cd server
npm run refresh:token
```

### Current production workflow (no cron)

1. Run the refresh job command above.
2. Redeploy/restart the Render backend service.
3. Verify the API response:

```bash
curl -sS 'https://detailing-site.onrender.com/api/instagram?refresh=true'
```

Token loading order is DB first, then `token.json`, then `CLIENT_TOKEN`.
