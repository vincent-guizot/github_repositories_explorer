# RepoCheck — GitHub Repository Checker

A GitHub repository explorer with **real GitHub OAuth login**, an Explorer to
search any public user/repository, and a dashboard of your own real
repositories (public and private). No mock/dummy data anywhere — everything
on screen comes live from the GitHub REST API.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- react-router-dom v7
- **framer-motion** for page transitions and micro-interactions
- axios + the GitHub REST API
- A tiny Express server (only used for the OAuth token exchange, see below)

## Why there's a small backend

This app uses **real GitHub OAuth**, not a fake "type any username" login.
GitHub's token endpoint (`github.com/login/oauth/access_token`):

- requires the OAuth App's **client secret**, which must never be shipped to
  the browser, and
- doesn't support cross-origin (CORS) requests from a browser anyway.

So a pure static SPA cannot complete the OAuth handshake by itself. The
`server/` folder contains a ~70-line Express app with exactly one job:
exchange the `code` GitHub sends back for an `access_token`, using the secret
that only the server knows. Once you have that token, **every other request**
(profile, repos, commits, search, etc.) is made directly from the browser to
`api.github.com`, which does support CORS.

## 1. Create a GitHub OAuth App

1. Go to <https://github.com/settings/developers> → **OAuth Apps** → **New OAuth App**.
2. Fill in:
   - **Application name**: RepoCheck (or anything)
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `http://localhost:5173/auth/callback`
3. Click **Register application**, then **Generate a new client secret**.
4. Copy the **Client ID** and **Client Secret**.

## 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_GITHUB_CLIENT_ID=your_client_id       # used by the browser (safe to expose)
GITHUB_CLIENT_ID=your_client_id            # used by the server
GITHUB_CLIENT_SECRET=your_client_secret    # used by the server — keep this secret!
```

## 3. Install and run

```bash
npm install
npm run dev:all
```

`dev:all` starts the Vite dev server (`:5173`) **and** the OAuth helper
server (`:8787`) together. Vite proxies `/api/*` requests to the helper
server, so you only ever visit `http://localhost:5173`.

If you'd rather run them separately (two terminals):

```bash
npm run dev      # frontend
npm run server   # OAuth helper backend
```

To build for production:

```bash
npm run build
npm run preview
```

> Deploying: the frontend can go anywhere static (Vercel, Netlify, GitHub
> Pages, ...). The `server/` folder needs to run somewhere that can hold a
> secret (a Node host, or port `server/index.js`'s two routes to a
> serverless function). Update the OAuth App's Homepage/callback URLs and
> `CLIENT_ORIGIN` in `.env` to match your deployed domain.

## How login works

1. Clicking **"Login dengan GitHub"** redirects to GitHub's real authorize
   page (`github.com/login/oauth/authorize`) with a random `state` value
   stored for CSRF protection.
2. You sign in and approve access **on github.com** — this app never sees
   your GitHub password.
3. GitHub redirects back to `/auth/callback?code=...&state=...`.
4. The frontend verifies `state`, then posts the `code` to the local backend
   (`POST /api/github/token`), which exchanges it for a real access token.
5. The token is used for every subsequent GitHub API call (`Authorization:
   Bearer <token>`), giving you the authenticated 5,000 requests/hour rate
   limit and access to your private repos (scope: `read:user repo`).
6. Logging out calls `POST /api/github/revoke`, which asks GitHub to revoke
   the token, then clears it locally.

The token is kept in `localStorage` so a page refresh keeps you signed in.
This is a pragmatic choice for a client-only app; a production app handling
sensitive data would typically keep the token server-side in an httpOnly
session cookie instead.

## Pages

- `/` — **Explorer**: search any GitHub **user** or **public repository** in
  real time (`/search/users`, `/search/repositories`)
- `/explore/users/:username` — a searched user's public profile + repos
  (read-only, works for anyone, no login required)
- `/login` — starts the real GitHub OAuth flow
- `/auth/callback` — completes the OAuth handshake
- `/my-repositories` — **your** real repositories (`/user/repos`, requires
  login), with search and aggregate stats
- `/repositories/:owner/:repo` — repository detail: Overview, Files
  (navigable file browser), Commits, Branches, About tabs, plus a sidebar
  with metadata, a languages bar, and top contributors — works for any
  repo, yours or someone else's

## Notes / limitations

- Search endpoints have a lower unauthenticated rate limit (10 requests/min);
  once you're logged in, requests use your token and get the higher limit.
- "Star" and "Watch" on the repository detail page link out to the real
  GitHub page for that action rather than performing it in-app.
- `server/index.js` is intentionally minimal (no database, no sessions) — it
  only proxies the OAuth token exchange and, optionally, token revocation.
