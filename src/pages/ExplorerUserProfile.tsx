import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Users,
  UserPlus,
  BookMarked,
  MapPin,
  Link2,
  RefreshCw,
  ExternalLink,
  Star,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  getUser,
  getUserRepos,
  getUserStarred,
  getUserFollowers,
  getUserFollowing,
  type GithubUser,
  type GithubRepo,
} from "../lib/github";
import RepoListItem from "../components/RepoListItem";

type Tab = "repositories" | "starred" | "followers" | "following";

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

export default function ExplorerUserProfile() {
  const { username = "" } = useParams();
  const [profile, setProfile] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [starred, setStarred] = useState<GithubRepo[]>([]);
  const [followers, setFollowers] = useState<GithubUser[]>([]);
  const [following, setFollowing] = useState<GithubUser[]>([]);

  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("repositories");

  const [query, setQuery] = useState("");
  const [langFilter, setLangFilter] = useState("all");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setActiveTab("repositories");
    setQuery("");
    setLangFilter("all");

    Promise.all([getUser(username), getUserRepos(username)])
      .then(([userData, repoData]) => {
        if (cancelled) return;
        setProfile(userData);
        setRepos(repoData);
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [username]);

  // Lazy load tab data
  useEffect(() => {
    if (!profile) return;
    let cancelled = false;

    if (activeTab === "starred" && starred.length === 0) {
      setTabLoading(true);
      getUserStarred(username)
        .then((data) => !cancelled && setStarred(data))
        .finally(() => !cancelled && setTabLoading(false));
    } else if (activeTab === "followers" && followers.length === 0) {
      setTabLoading(true);
      getUserFollowers(username)
        .then((data) => !cancelled && setFollowers(data))
        .finally(() => !cancelled && setTabLoading(false));
    } else if (activeTab === "following" && following.length === 0) {
      setTabLoading(true);
      getUserFollowing(username)
        .then((data) => !cancelled && setFollowing(data))
        .finally(() => !cancelled && setTabLoading(false));
    }

    return () => {
      cancelled = true;
    };
  }, [activeTab, username, profile, starred.length, followers.length, following.length]);

  const targetRepos = activeTab === "starred" ? starred : repos;

  const availableLanguages = useMemo(() => {
    const set = new Set<string>();
    targetRepos.forEach((r) => {
      if (r.language) set.add(r.language);
    });
    return Array.from(set).sort();
  }, [targetRepos]);

  const filteredRepos = useMemo(() => {
    let list = targetRepos.filter((r) =>
      r.name.toLowerCase().includes(query.trim().toLowerCase())
    );
    if (langFilter !== "all") {
      list = list.filter((r) => r.language === langFilter);
    }
    return list;
  }, [targetRepos, query, langFilter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-32 text-slate-400 dark:text-slate-500">
        <RefreshCw size={20} className="animate-spin text-indigo-500" />
        <p className="text-sm">Memuat profil...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-sm text-red-500">{error || "User tidak ditemukan."}</p>
        <Link to="/" className="mt-4 inline-block text-sm font-medium text-indigo-600 dark:text-indigo-400">
          &larr; Back to Explorer
        </Link>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; count?: number; icon: React.ReactNode }[] = [
    {
      id: "repositories",
      label: "Repositories",
      count: profile.public_repos,
      icon: <BookMarked size={14} />,
    },
    {
      id: "starred",
      label: "Starred",
      count: starred.length > 0 ? starred.length : undefined,
      icon: <Star size={14} />,
    },
    {
      id: "followers",
      label: "Followers",
      count: profile.followers,
      icon: <Users size={14} />,
    },
    {
      id: "following",
      label: "Following",
      count: profile.following,
      icon: <UserPlus size={14} />,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
      >
        <ArrowLeft size={15} />
        Back to Explorer
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-5 flex flex-col items-start gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:p-8 dark:border-slate-800 dark:bg-slate-900"
      >
        <img
          src={profile.avatar_url}
          alt={profile.login}
          className="h-20 w-20 shrink-0 rounded-2xl ring-1 ring-slate-200 dark:ring-slate-700"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {profile.name || profile.login}
            </h1>
            <a
              href={profile.html_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-sm text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400"
            >
              @{profile.login}
              <ExternalLink size={12} />
            </a>
          </div>
          {profile.bio && (
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{profile.bio}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <BookMarked size={14} /> {profile.public_repos} repos
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={14} /> {profile.followers} followers
            </span>
            <span className="flex items-center gap-1.5">
              <UserPlus size={14} /> {profile.following} following
            </span>
            {profile.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} /> {profile.location}
              </span>
            )}
          </div>
        </div>
        <a
          href={profile.html_url}
          target="_blank"
          rel="noreferrer"
          className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Link2 size={15} />
          View on GitHub
        </a>
      </motion.div>

      {/* Profile Navigation Tabs */}
      <div className="mt-8 flex gap-6 overflow-x-auto border-b border-slate-200 dark:border-slate-800">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setActiveTab(t.id);
              setQuery("");
              setLangFilter("all");
            }}
            className={`relative flex items-center gap-1.5 whitespace-nowrap pb-3 text-sm font-medium transition-colors ${
              activeTab === t.id
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
            {t.count !== undefined && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                {t.count}
              </span>
            )}
            {activeTab === t.id && (
              <motion.span
                layoutId="user-profile-tab"
                className="absolute inset-x-0 -bottom-px h-0.5 bg-indigo-600 dark:bg-indigo-400"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <AnimatePresence mode="wait">
          {tabLoading ? (
            <div className="flex justify-center py-20 text-slate-400 dark:text-slate-500">
              <RefreshCw size={20} className="animate-spin text-indigo-500" />
            </div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {/* Repositories & Starred Tab View */}
              {(activeTab === "repositories" || activeTab === "starred") && (
                <div>
                  {targetRepos.length > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-6 py-3 text-xs dark:border-slate-800 dark:bg-slate-800/40">
                      <div className="relative flex-1 sm:max-w-xs">
                        <Search
                          size={13}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Cari dalam daftar..."
                          className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        />
                      </div>

                      {availableLanguages.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <SlidersHorizontal size={13} className="text-slate-400" />
                          <select
                            value={langFilter}
                            onChange={(e) => setLangFilter(e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                          >
                            <option value="all">Semua Bahasa</option>
                            {availableLanguages.map((l) => (
                              <option key={l} value={l}>
                                {l}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}

                  {filteredRepos.length === 0 ? (
                    <p className="px-6 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                      {targetRepos.length === 0
                        ? activeTab === "starred"
                          ? "Pengguna ini belum membintangi (star) repository apa pun."
                          : "Belum ada repository publik."
                        : `Tidak ada repository yang cocok dengan pencarian.`}
                    </p>
                  ) : (
                    <motion.div variants={listVariants} initial="hidden" animate="show">
                      {filteredRepos.map((repo) => (
                        <RepoListItem key={repo.id} repo={repo} />
                      ))}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Followers Tab View */}
              {activeTab === "followers" && (
                <div>
                  {followers.length === 0 ? (
                    <p className="px-6 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                      Belum ada follower.
                    </p>
                  ) : (
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                      {followers.map((u) => (
                        <li
                          key={u.id}
                          className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50/70 transition-colors dark:hover:bg-slate-800/40"
                        >
                          <Link
                            to={`/explore/users/${u.login}`}
                            className="flex items-center gap-3 font-semibold text-sm text-slate-800 hover:text-indigo-600 dark:text-slate-100 dark:hover:text-indigo-400"
                          >
                            <img
                              src={u.avatar_url}
                              alt={u.login}
                              className="h-10 w-10 rounded-full ring-1 ring-slate-200 dark:ring-slate-700"
                            />
                            <span>{u.login}</span>
                          </Link>
                          <a
                            href={u.html_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                          >
                            <span>GitHub</span>
                            <ExternalLink size={12} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Following Tab View */}
              {activeTab === "following" && (
                <div>
                  {following.length === 0 ? (
                    <p className="px-6 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                      Belum mengikuti siapa pun.
                    </p>
                  ) : (
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                      {following.map((u) => (
                        <li
                          key={u.id}
                          className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50/70 transition-colors dark:hover:bg-slate-800/40"
                        >
                          <Link
                            to={`/explore/users/${u.login}`}
                            className="flex items-center gap-3 font-semibold text-sm text-slate-800 hover:text-indigo-600 dark:text-slate-100 dark:hover:text-indigo-400"
                          >
                            <img
                              src={u.avatar_url}
                              alt={u.login}
                              className="h-10 w-10 rounded-full ring-1 ring-slate-200 dark:ring-slate-700"
                            />
                            <span>{u.login}</span>
                          </Link>
                          <a
                            href={u.html_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                          >
                            <span>GitHub</span>
                            <ExternalLink size={12} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
