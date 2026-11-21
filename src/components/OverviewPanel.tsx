import { useEffect, useState } from "react";
import { BookOpen, RefreshCw, AlertCircle, FileText, Scale, GitBranch, Code2, AlertOctagon, Clock } from "lucide-react";
import { getRepoReadmeHtml, type GithubRepo } from "../lib/github";
import { formatDate, timeAgo } from "../lib/format";

export default function OverviewPanel({
  owner,
  repo,
  repoData,
}: {
  owner: string;
  repo: string;
  repoData: GithubRepo;
}) {
  const [readmeHtml, setReadmeHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getRepoReadmeHtml(owner, repo)
      .then((html) => {
        if (!cancelled) setReadmeHtml(html);
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
  }, [owner, repo]);

  return (
    <div className="space-y-6 p-6">
      {/* Quick Summary Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <Scale size={13} />
            <span>License</span>
          </div>
          <p className="mt-1 font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">
            {repoData.license?.spdx_id || repoData.license?.name || "None"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <GitBranch size={13} />
            <span>Default Branch</span>
          </div>
          <p className="mt-1 font-semibold text-sm text-indigo-600 dark:text-indigo-400 truncate">
            {repoData.default_branch}
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <Code2 size={13} />
            <span>Repo Size</span>
          </div>
          <p className="mt-1 font-semibold text-sm text-slate-800 dark:text-slate-100">
            {(repoData.size / 1024).toFixed(1)} MB
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <AlertOctagon size={13} />
            <span>Open Issues</span>
          </div>
          <p className="mt-1 font-semibold text-sm text-slate-800 dark:text-slate-100">
            {repoData.open_issues_count}
          </p>
        </div>
      </div>

      {/* README Header & Renderer */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-800/60">
          <BookOpen size={16} className="text-indigo-500" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            README.md
          </span>
          <span className="ml-auto flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
            <Clock size={12} />
            Push: {timeAgo(repoData.pushed_at)}
          </span>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400 dark:text-slate-500">
              <RefreshCw size={20} className="animate-spin text-indigo-500" />
              <p className="text-sm">Memuat README.md...</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex items-center gap-2 py-10 text-center justify-center text-sm text-red-500">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && !readmeHtml && (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-slate-400 dark:text-slate-500">
              <FileText size={32} className="opacity-40" />
              <p className="text-sm font-medium">Repository ini belum menyediakan README.md.</p>
              <p className="text-xs">Buka tab Files untuk melihat struktur kode dan berkas proyek.</p>
            </div>
          )}

          {!loading && !error && readmeHtml && (
            <div
              className="markdown-body text-slate-800 dark:text-slate-200 text-sm overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: readmeHtml }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
