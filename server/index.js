// Minimal backend used ONLY for the GitHub OAuth handshake.
//
// GitHub's token endpoint (github.com/login/oauth/access_token) does not
// allow browser-based (CORS) requests, and exchanging a code for a token
// requires the OAuth App's client secret, which must never be shipped to
// the browser. This tiny server is the one piece of "backend" needed to
// make real GitHub login work from an otherwise fully static SPA.
//
// Everything else (repos, user profile, commits, search, etc.) is fetched
// directly from the browser using api.github.com, which supports CORS.

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  PORT = 8787,
  CLIENT_ORIGIN = "http://localhost:5173",
} = process.env;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  console.warn(
    "\n[repocheck-server] Warning: GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET are not set.\n" +
      "Create a GitHub OAuth App and copy .env.example to .env before logging in.\n"
  );
}

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.post("/api/github/token", async (req, res) => {
  const { code } = req.body || {};
  if (!code) return res.status(400).json({ error: "Missing 'code'." });

  try {
    const ghRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const data = await ghRes.json();

    if (data.error) {
      return res.status(400).json({ error: data.error_description || data.error });
    }

    res.json({
      access_token: data.access_token,
      token_type: data.token_type,
      scope: data.scope,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Token exchange failed." });
  }
});

app.post("/api/github/revoke", async (req, res) => {
  const { token } = req.body || {};
  if (!token) return res.status(400).json({ error: "Missing 'token'." });

  try {
    await fetch(
      `https://api.github.com/applications/${GITHUB_CLIENT_ID}/token`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization:
            "Basic " +
            Buffer.from(`${GITHUB_CLIENT_ID}:${GITHUB_CLIENT_SECRET}`).toString(
              "base64"
            ),
        },
        body: JSON.stringify({ access_token: token }),
      }
    );
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Revoke failed." });
  }
});

app.listen(PORT, () => {
  console.log(`[repocheck-server] OAuth helper listening on http://localhost:${PORT}`);
});
