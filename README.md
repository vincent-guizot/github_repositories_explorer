# RepoCheck — GitHub Repository Checker

A redesign of the original `github_repositories_explorer` app, rebuilt to match the
RepoCheck UI (login, home, my repositories, repository detail).

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- react-router-dom v7
- lucide-react icons
- axios + the public GitHub REST API (no backend, no API key required for light usage)

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## How "login" works

There's no real backend or GitHub OAuth app configured here (that would require a
server to keep a client secret), so **login accepts any real GitHub username** in
place of email/password and verifies it against `GET /users/{username}`. Once
"logged in," the app fetches that user's live public repositories, stats,
languages, contributors, commits, branches, and file tree straight from the
GitHub API — all the data on screen is real, not mocked.

The session (just the username) is kept in `localStorage`, so refreshing the page
keeps you logged in.

## Pages

- `/` — Home / marketing landing page
- `/login` — Login page (enter a GitHub username, e.g. `octocat`)
- `/my-repositories` — Dashboard listing the logged-in user's repositories, with
  search and aggregate stats (total repos / stars / forks / watchers)
- `/repositories/:owner/:repo` — Repository detail page with Overview, Files
  (navigable file browser), Commits, Branches, and About tabs, plus a sidebar
  with metadata, a languages breakdown bar, and top contributors

## Notes / limitations

- Unauthenticated GitHub API requests are rate-limited to 60 requests/hour per
  IP. If you hit the limit, the UI will show a friendly rate-limit message.
- The "Star" and "Watch" buttons on the repository detail page link out to the
  real GitHub page for that action rather than performing it in-app, since that
  requires an authenticated GitHub session.
