import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Users,
  FolderGit2,
  Rocket,
  RefreshCw,
  SearchX,
} from "lucide-react";
import {
  searchUsers,
  searchRepositories,
  type GithubSearchUser,
  type GithubRepo,
} from "../lib/github";
import UserResultCard from "../components/UserResultCard";
import RepoResultCard from "../components/RepoResultCard";

type Mode = "users" | "repositories";

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const SUGGESTIONS: Record<Mode, string[]> = {
  users: ["vincent-guizot", "react", "vercel"],
  repositories: ["facebook/react", "vuejs/vue", "microsoft/vscode"],
};

export default function Home() {
  const [mode, setMode] = useState<Mode>("users");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<GithubSearchUser[]>([]);
  const [repos, setRepos] = useState<GithubRepo[]>([]);

  async function runSearch(q: string, m: Mode) {
    const trimmed = q.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setSubmittedQuery(trimmed);
    try {
      if (m === "users") {
        setUsers(await searchUsers(trimmed));
      } else {
        setRepos(await searchRepositories(trimmed));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pencarian gagal.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    runSearch(query, mode);
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    if (submittedQuery) runSearch(submittedQuery, next);
  }

  function trySuggestion(s: string) {
    setQuery(s);
    runSearch(s, mode);
  }

  const results = mode === "users" ? users : repos;
  const hasSearched = submittedQuery.length > 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-14 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
          <Rocket size={14} />
          Check. Explore. Code.
        </span>

        <h1 className="mt-6 max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl dark:text-white">
          Cek Repository{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            GitHub
          </span>{" "}
          dengan Mudah
        </h1>

        <p className="mt-4 max-w-lg text-base text-slate-500 dark:text-slate-400">
          Cari akun atau repository publik mana pun di GitHub, langsung dari
          data real-time GitHub API.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-10 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex border-b border-slate-100 dark:border-slate-800">
          {(["users", "repositories"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`relative flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors ${
                mode === m
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {m === "users" ? <Users size={15} /> : <FolderGit2 size={15} />}
              {m === "users" ? "Users" : "Repositories"}
              {mode === m && (
                <motion.span
                  layoutId="explorer-tab"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-indigo-600 dark:bg-indigo-400"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2.5 p-5 sm:p-6">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                mode === "users"
                  ? "Cari username GitHub..."
                  : "Cari repository, mis. facebook/react"
              }
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-indigo-500/20"
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={!query.trim() || loading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Search size={15} />
            Cari
          </motion.button>
        </form>

        {!hasSearched && (
          <div className="flex flex-wrap items-center gap-2 px-5 pb-6 sm:px-6">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Coba:
            </span>
            {SUGGESTIONS[mode].map((s) => (
              <button
                key={s}
                onClick={() => trySuggestion(s)}
                className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {hasSearched && (
            <motion.div
              key={mode + submittedQuery + loading}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-slate-100 dark:border-slate-800"
            >
              {loading && (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400 dark:text-slate-500">
                  <RefreshCw size={20} className="animate-spin" />
                  <p className="text-sm">Mencari...</p>
                </div>
              )}

              {!loading && error && (
                <div className="py-16 text-center text-sm text-red-500">
                  {error}
                </div>
              )}

              {!loading && !error && results.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-16 text-slate-400 dark:text-slate-500">
                  <SearchX size={22} />
                  <p className="text-sm">
                    Tidak ada hasil untuk &quot;{submittedQuery}&quot;.
                  </p>
                </div>
              )}

              {!loading && !error && results.length > 0 && (
                <motion.div
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                >
                  {mode === "users"
                    ? users.map((u) => <UserResultCard key={u.id} user={u} />)
                    : repos.map((r) => <RepoResultCard key={r.id} repo={r} />)}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-14 flex flex-col items-center gap-2 text-center"
      >
        <p className="text-sm text-slate-400 dark:text-slate-500">
          Dibuat untuk developer, oleh developer.
          <br />
          Data bersumber langsung dari{" "}
          <a
            href="https://docs.github.com/en/rest"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-indigo-500 hover:underline dark:text-indigo-400"
          >
            GitHub API
          </a>
          .
        </p>
      </motion.div>
    </div>
  );
}
