import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Folder, Search, Code2, Star, GitFork, Eye, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getUserRepos, type GithubRepo } from "../lib/github";
import StatCard from "../components/StatCard";
import RepoListItem from "../components/RepoListItem";

export default function MyRepositories() {
  const { user, loading: authLoading } = useAuth();
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getUserRepos(user.login)
      .then((data) => {
        if (!cancelled) setRepos(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const filtered = useMemo(
    () =>
      repos.filter((r) =>
        r.name.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [repos, query]
  );

  const totals = useMemo(
    () => ({
      repos: repos.length,
      stars: repos.reduce((sum, r) => sum + r.stargazers_count, 0),
      forks: repos.reduce((sum, r) => sum + r.forks_count, 0),
      watchers: repos.reduce((sum, r) => sum + r.watchers_count, 0),
    }),
    [repos]
  );

  if (!authLoading && !user) return <Navigate to="/login" replace />;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
            <Folder size={22} />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              My Repositories
            </h1>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Daftar repository publik milik akun GitHub kamu.
            </p>
          </div>
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari repository..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:w-72 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-indigo-500/20"
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white shadow-sm sm:grid-cols-4 sm:divide-y-0 sm:divide-x dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
        <StatCard icon={<Code2 size={19} />} value={totals.repos} label="Total Repository" tint="indigo" />
        <StatCard icon={<Star size={19} />} value={totals.stars} label="Total Stars" tint="green" />
        <StatCard icon={<GitFork size={19} />} value={totals.forks} label="Total Forks" tint="blue" />
        <StatCard icon={<Eye size={19} />} value={totals.watchers} label="Total Watchers" tint="amber" />
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400 dark:text-slate-500">
            <RefreshCw size={20} className="animate-spin" />
            <p className="text-sm">Memuat repository...</p>
          </div>
        )}

        {!loading && error && (
          <div className="py-16 text-center text-sm text-red-500">{error}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">
            Tidak ada repository yang cocok dengan pencarian "{query}".
          </div>
        )}

        {!loading &&
          !error &&
          filtered.map((repo) => <RepoListItem key={repo.id} repo={repo} />)}
      </div>
    </div>
  );
}
