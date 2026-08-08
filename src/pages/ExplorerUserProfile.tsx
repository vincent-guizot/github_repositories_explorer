import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  UserPlus,
  BookMarked,
  MapPin,
  Link2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { getUser, getUserRepos, type GithubUser, type GithubRepo } from "../lib/github";
import RepoListItem from "../components/RepoListItem";

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

export default function ExplorerUserProfile() {
  const { username = "" } = useParams();
  const [profile, setProfile] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-32 text-slate-400 dark:text-slate-500">
        <RefreshCw size={20} className="animate-spin" />
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

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 px-6 py-4 sm:px-8 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Public Repositories
          </h2>
        </div>

        {repos.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-slate-400 dark:text-slate-500">
            Belum ada repository publik.
          </p>
        ) : (
          <motion.div variants={listVariants} initial="hidden" animate="show">
            {repos.map((repo) => (
              <RepoListItem key={repo.id} repo={repo} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
