import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getAuthenticatedUser,
  setAuthToken,
  type GithubUser,
} from "../lib/github";
import { exchangeCodeForToken, revokeToken } from "../lib/oauth";

const TOKEN_KEY = "repocheck.access_token";

interface AuthContextValue {
  user: GithubUser | null;
  token: string | null;
  /** True while restoring a session on first load, or while exchanging an
   * OAuth code for a token right after the GitHub redirect. */
  loading: boolean;
  error: string | null;
  /** Called by the /auth/callback route once GitHub redirects back with a code. */
  completeLogin: (code: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GithubUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore an existing session (real GitHub token) on first load.
  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (!saved) {
      setLoading(false);
      return;
    }
    setAuthToken(saved);
    getAuthenticatedUser()
      .then((data) => {
        setToken(saved);
        setUser(data);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setAuthToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const completeLogin = useCallback(async (code: string) => {
    setError(null);
    setLoading(true);
    try {
      const { access_token } = await exchangeCodeForToken(code);
      setAuthToken(access_token);
      const profile = await getAuthenticatedUser();
      localStorage.setItem(TOKEN_KEY, access_token);
      setToken(access_token);
      setUser(profile);
    } catch (err) {
      setAuthToken(null);
      setError(
        err instanceof Error ? err.message : "Login dengan GitHub gagal."
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    if (token) revokeToken(token);
    setUser(null);
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem(TOKEN_KEY);
  }, [token]);

  const value = useMemo(
    () => ({ user, token, loading, error, completeLogin, logout }),
    [user, token, loading, error, completeLogin, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
