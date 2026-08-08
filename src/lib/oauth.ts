const STATE_KEY = "repocheck.oauth_state";

const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID as string | undefined;

export function isOAuthConfigured(): boolean {
  return Boolean(CLIENT_ID);
}

function randomState(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function getRedirectUri(): string {
  return `${window.location.origin}/auth/callback`;
}

/** Builds the GitHub authorize URL and stashes a CSRF state token. */
export function buildAuthorizeUrl(): string {
  if (!CLIENT_ID) {
    throw new Error(
      "VITE_GITHUB_CLIENT_ID belum diatur. Lihat .env.example untuk setup OAuth App."
    );
  }
  const state = randomState();
  sessionStorage.setItem(STATE_KEY, state);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: getRedirectUri(),
    scope: "read:user repo",
    state,
    allow_signup: "true",
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export function consumeExpectedState(): string | null {
  const state = sessionStorage.getItem(STATE_KEY);
  sessionStorage.removeItem(STATE_KEY);
  return state;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

/** Exchanges an OAuth `code` for an access token via our backend helper. */
export async function exchangeCodeForToken(code: string): Promise<TokenResponse> {
  const res = await fetch("/api/github/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Gagal menukar kode OAuth dengan token.");
  }
  return data;
}

export async function revokeToken(token: string): Promise<void> {
  try {
    await fetch("/api/github/revoke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  } catch {
    // best-effort; local logout still proceeds even if revoke fails
  }
}
