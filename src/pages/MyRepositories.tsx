import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Folder,
  Search,
  Code2,
  Star,
  GitFork,
  Eye,
  RefreshCw,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getAuthenticatedUserRepos, type GithubRepo } from "../lib/github";
import StatCard from "../components/StatCard";
import RepoListItem from "../components/RepoListItem";

type RepoSort = "stars" | "forks" | "updated" | "name";

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

export default function MyRepositories() {
  const { user, loading: authLoading } = useAuth();
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [repoSort, setRepoSort] = useState<RepoSort>("updated");
  const [langFilter, setLangFilter] = useState<string>("all");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getAuthenticatedUserRepos()
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

  const availableLanguages = useMemo(() => {
    const set = new Set<string>();
    repos.forEach((r) => {
      if (r.language) set.add(r.language);
    });
    return Array.from(set).sort();
  }, [repos]);

  const filtered = useMemo(() => {
    let list = repos.filter((r) =>
      r.name.toLowerCase().includes(query.trim().toLowerCase())
    );
    if (langFilter !== "all") {
      list = list.filter((r) => r.language === langFilter);
    }
    list.sort((a, b) => {
      if (repoSort === "stars") return b.stargazers_count - a.stargazers_count;
      if (repoSort === "forks") return b.forks_count - a.forks_count;
      if (repoSort === "updated")
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      if (repoSort === "name") return a.name.localeCompare(b.name);
      return 0;
    });
    return list;
  }, [repos, query, langFilter, repoSort]);

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
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
            <Folder size={22} />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              My Repositories
            </h1>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Repository asli milik akun GitHub {user ? `@${user.login}` : "kamu"} — publik &amp; privat.
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-8 grid grid-cols-2 divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white shadow-sm sm:grid-cols-4 sm:divide-y-0 sm:divide-x dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900"
      >
        <StatCard icon={<Code2 size={19} />} value={totals.repos} label="Total Repository" tint="indigo" />
        <StatCard icon={<Star size={19} />} value={totals.stars} label="Total Stars" tint="green" />
        <StatCard icon={<GitFork size={19} />} value={totals.forks} label="Total Forks" tint="blue" />
        <StatCard icon={<Eye size={19} />} value={totals.watchers} label="Total Watchers" tint="amber" />
      </motion.div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {!loading && !error && repos.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-6 py-3.5 text-xs dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-slate-400" />
              <span className="font-medium text-slate-600 dark:text-slate-300">
                Bahasa:
              </span>
              <select
                value={langFilter}
                onChange={(e) => setLangFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-700 outline-none transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="all">Semua Bahasa</option>
                {availableLanguages.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown size={14} className="text-slate-400" />
              <span className="font-medium text-slate-600 dark:text-slate-300">
                Urutkan:
              </span>
              <select
                value={repoSort}
                onChange={(e) => setRepoSort(e.target.value as RepoSort)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-700 outline-none transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="updated">🕒 Baru Diupdate</option>
                <option value="stars">⭐ Bintang Terbanyak</option>
                <option value="forks">🍴 Forks Terbanyak</option>
                <option value="name">🔤 Nama (A-Z)</option>
              </select>
            </div>
          </div>
        )}
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
            {repos.length === 0
              ? "Belum ada repository pada akun ini."
              : `Tidak ada repository yang cocok dengan pencarian "${query}".`}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <motion.div variants={listVariants} initial="hidden" animate="show">
            {filtered.map((repo) => (
              <RepoListItem key={repo.id} repo={repo} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
