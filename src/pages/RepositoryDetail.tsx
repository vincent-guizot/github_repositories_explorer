import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Code2,
  Star,
  Eye,
  GitFork,
  Scale,
  Calendar,
  Clock,
  GitBranch,
  Link2,
  RefreshCw,
  ChevronRight,
  Home,
} from "lucide-react";
import {
  getRepo,
  getRepoLanguages,
  getRepoContributors,
  getRepoContents,
  getRepoCommits,
  getRepoBranches,
  type GithubRepo,
  type GithubContentItem,
  type GithubContributor,
  type GithubCommit,
  type GithubBranch,
} from "../lib/github";
import { formatCount, formatDate, timeAgo, languageColor } from "../lib/format";
import FileRow from "../components/FileRow";

type Tab = "overview" | "files" | "commits" | "branches" | "about";

export default function RepositoryDetail() {
  const { owner = "", repo = "" } = useParams();
  const [data, setData] = useState<GithubRepo | null>(null);
  const [languages, setLanguages] = useState<Record<string, number>>({});
  const [contributors, setContributors] = useState<GithubContributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      getRepo(owner, repo),
      getRepoLanguages(owner, repo),
      getRepoContributors(owner, repo),
    ])
      .then(([repoData, langs, contribs]) => {
        if (cancelled) return;
        setData(repoData);
        setLanguages(langs);
        setContributors(contribs);
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [owner, repo]);

  const languageTotal = useMemo(
    () => Object.values(languages).reduce((a, b) => a + b, 0),
    [languages]
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-32 text-slate-400 dark:text-slate-500">
        <RefreshCw size={20} className="animate-spin" />
        <p className="text-sm">Memuat repository...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-sm text-red-500">{error || "Repository tidak ditemukan."}</p>
        <Link to="/my-repositories" className="mt-4 inline-block text-sm font-medium text-indigo-600 dark:text-indigo-400">
          &larr; Back to My Repositories
        </Link>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "files", label: "Files" },
    { id: "commits", label: "Commits" },
    { id: "branches", label: "Branches" },
    { id: "about", label: "About" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
      <Link
        to="/my-repositories"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
      >
        <ArrowLeft size={15} />
        Back to My Repositories
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
            <Code2 size={24} />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{data.name}</h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                {data.private ? "Private" : "Public"}
              </span>
            </div>
            <p className="mt-1.5 max-w-xl text-sm text-slate-500 dark:text-slate-400">
              {data.description || "No description"}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-slate-500 dark:text-slate-400">
              {data.language && (
                <span className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: languageColor(data.language) }}
                  />
                  {data.language}
                </span>
              )}
              {data.license && (
                <span className="flex items-center gap-1.5">
                  <Scale size={14} /> {data.license.spdx_id}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Star size={14} /> {formatCount(data.stargazers_count)} Stars
              </span>
              <span className="flex items-center gap-1.5">
                <GitFork size={14} /> {formatCount(data.forks_count)} Forks
              </span>
              <span className="flex items-center gap-1.5">
                <Eye size={14} /> {formatCount(data.watchers_count)} Watchers
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-3">
          <a
            href={`${data.html_url}/stargazers`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Star size={15} />
            Star
          </a>
          <a
            href={`${data.html_url}/watchers`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-transform hover:-translate-y-0.5"
          >
            <Eye size={15} />
            Watch
          </a>
        </div>
      </motion.div>

      <div className="mt-8 flex gap-6 overflow-x-auto border-b border-slate-200 dark:border-slate-800">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative whitespace-nowrap pb-3 text-sm font-medium transition-colors ${
              tab === t.id
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {t.label}
            {tab === t.id && (
              <motion.span
                layoutId="repo-tab"
                className="absolute inset-x-0 -bottom-px h-0.5 bg-indigo-600 dark:bg-indigo-400"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {tab === "overview" && <FilesPanel owner={owner} repo={repo} root />}
              {tab === "files" && <FilesPanel owner={owner} repo={repo} />}
              {tab === "commits" && <CommitsPanel owner={owner} repo={repo} />}
              {tab === "branches" && (
                <BranchesPanel owner={owner} repo={repo} defaultBranch={data.default_branch} />
              )}
              {tab === "about" && <AboutPanel data={data} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              About this repository
            </h3>
            <dl className="mt-4 space-y-3 text-sm">
              <Row icon={<Calendar size={14} />} label="Created" value={formatDate(data.created_at)} />
              <Row icon={<Clock size={14} />} label="Last updated" value={timeAgo(data.updated_at)} />
              <Row
                icon={<Link2 size={14} />}
                label="Repository"
                value={
                  <a
                    href={data.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    github.com/{data.full_name}
                  </a>
                }
              />
              <Row
                icon={<GitBranch size={14} />}
                label="Default branch"
                value={
                  <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                    {data.default_branch}
                  </span>
                }
              />
            </dl>
          </div>

          {languageTotal > 0 && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Languages</h3>
              <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                {Object.entries(languages).map(([lang, bytes]) => (
                  <div
                    key={lang}
                    style={{
                      width: `${(bytes / languageTotal) * 100}%`,
                      backgroundColor: languageColor(lang),
                    }}
                  />
                ))}
              </div>
              <ul className="mt-4 space-y-2">
                {Object.entries(languages)
                  .sort((a, b) => b[1] - a[1])
                  .map(([lang, bytes]) => (
                    <li key={lang} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: languageColor(lang) }}
                        />
                        {lang}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500">
                        {((bytes / languageTotal) * 100).toFixed(1)}%
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {contributors.length > 0 && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Top Contributors</h3>
              <ul className="mt-4 space-y-3.5">
                {contributors.map((c) => (
                  <li key={c.login}>
                    <a
                      href={c.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 text-sm"
                    >
                      <img src={c.avatar_url} alt={c.login} className="h-8 w-8 rounded-full" />
                      <span className="flex-1 truncate font-medium text-slate-700 dark:text-slate-200">
                        {c.login}
                      </span>
                      <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                        {formatCount(c.contributions)} commits
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
        {icon}
        {label}
      </span>
      <span className="min-w-0 truncate text-right font-medium text-slate-700 dark:text-slate-200">
        {value}
      </span>
    </div>
  );
}

function FilesPanel({
  owner,
  repo,
  root = false,
}: {
  owner: string;
  repo: string;
  root?: boolean;
}) {
  const [path, setPath] = useState("");
  const [items, setItems] = useState<GithubContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getRepoContents(owner, repo, path).then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, [owner, repo, path]);

  const crumbs = path ? path.split("/") : [];

  return (
    <div>
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
        <div className="flex min-w-0 items-center gap-1.5 text-sm">
          <button
            onClick={() => !root && setPath("")}
            className="flex items-center gap-1 font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
          >
            <Home size={13} />
            {repo}
          </button>
          {!root &&
            crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5 truncate">
                <ChevronRight size={13} className="text-slate-300 dark:text-slate-600" />
                <button
                  onClick={() => setPath(crumbs.slice(0, i + 1).join("/"))}
                  className="truncate text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  {c}
                </button>
              </span>
            ))}
        </div>
        <span className="shrink-0 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-400 dark:bg-slate-800 dark:text-slate-500">
          main
        </span>
      </div>

      {loading && (
        <div className="flex justify-center py-12 text-slate-400 dark:text-slate-500">
          <RefreshCw size={16} className="animate-spin" />
        </div>
      )}

      {!loading && items.length === 0 && (
        <p className="px-5 py-10 text-center text-sm text-slate-400 dark:text-slate-500">
          Folder ini kosong.
        </p>
      )}

      {!loading &&
        items.map((item) => (
          <FileRow
            key={item.path}
            item={item}
            onOpen={(i) => !root && setPath(i.path)}
          />
        ))}
    </div>
  );
}

function CommitsPanel({ owner, repo }: { owner: string; repo: string }) {
  const [commits, setCommits] = useState<GithubCommit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRepoCommits(owner, repo).then((data) => {
      setCommits(data);
      setLoading(false);
    });
  }, [owner, repo]);

  if (loading)
    return (
      <div className="flex justify-center py-12 text-slate-400 dark:text-slate-500">
        <RefreshCw size={16} className="animate-spin" />
      </div>
    );

  if (commits.length === 0)
    return (
      <p className="px-5 py-10 text-center text-sm text-slate-400 dark:text-slate-500">
        Tidak ada commit untuk ditampilkan.
      </p>
    );

  return (
    <ul>
      {commits.map((c) => (
        <li key={c.sha} className="border-b border-slate-100 px-5 py-4 last:border-b-0 dark:border-slate-800">
          <a
            href={c.html_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-start justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400">
                {c.commit.message.split("\n")[0]}
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                {c.commit.author.name} &middot; {timeAgo(c.commit.author.date)}
              </p>
            </div>
            <span className="shrink-0 rounded-md bg-slate-50 px-2 py-1 font-mono text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {c.sha.slice(0, 7)}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function BranchesPanel({
  owner,
  repo,
  defaultBranch,
}: {
  owner: string;
  repo: string;
  defaultBranch: string;
}) {
  const [branches, setBranches] = useState<GithubBranch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRepoBranches(owner, repo).then((data) => {
      setBranches(data);
      setLoading(false);
    });
  }, [owner, repo]);

  if (loading)
    return (
      <div className="flex justify-center py-12 text-slate-400 dark:text-slate-500">
        <RefreshCw size={16} className="animate-spin" />
      </div>
    );

  return (
    <ul>
      {branches.map((b) => (
        <li
          key={b.name}
          className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 text-sm last:border-b-0 dark:border-slate-800"
        >
          <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <GitBranch size={15} className="text-slate-400" />
            {b.name}
            {b.name === defaultBranch && (
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                default
              </span>
            )}
          </span>
          <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
            {b.commit.sha.slice(0, 7)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function AboutPanel({ data }: { data: GithubRepo }) {
  return (
    <div className="space-y-5 px-6 py-6 text-sm">
      <p className="text-slate-600 dark:text-slate-300">
        {data.description || "No description provided."}
      </p>

      {data.homepage && (
        <a
          href={data.homepage}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          <Link2 size={14} /> {data.homepage}
        </a>
      )}

      {data.topics?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.topics.map((t) => (
            <span
              key={t}
              className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <dl className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 dark:border-slate-800">
        <Row icon={<Scale size={14} />} label="License" value={data.license?.name || "None"} />
        <Row icon={<Code2 size={14} />} label="Size" value={`${(data.size / 1024).toFixed(1)} MB`} />
        <Row icon={<Calendar size={14} />} label="Created" value={formatDate(data.created_at)} />
        <Row icon={<Clock size={14} />} label="Last push" value={timeAgo(data.pushed_at)} />
      </dl>
    </div>
  );
}
