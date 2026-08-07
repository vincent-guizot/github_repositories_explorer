import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getUser, type GithubUser } from "../lib/github";

const STORAGE_KEY = "repocheck.username";

interface AuthContextValue {
  user: GithubUser | null;
  loading: boolean;
  error: string | null;
  login: (username: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GithubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setLoading(false);
      return;
    }
    getUser(saved)
      .then(setUser)
      .catch(() => localStorage.removeItem(STORAGE_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (username: string) => {
    setError(null);
    setLoading(true);
    try {
      const data = await getUser(username);
      setUser(data);
      localStorage.setItem(STORAGE_KEY, data.login);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Username GitHub tidak ditemukan."
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ user, loading, error, login, logout }),
    [user, loading, error, login, logout]
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
