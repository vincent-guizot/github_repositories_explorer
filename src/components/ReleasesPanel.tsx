import { useEffect, useState } from "react";
import {
  Tag,
  Download,
  Calendar,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  PackageCheck,
  FileArchive,
} from "lucide-react";
import { getRepoReleases, type GithubRelease } from "../lib/github";
import { formatDate, timeAgo } from "../lib/format";

export default function ReleasesPanel({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) {
  const [releases, setReleases] = useState<GithubRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getRepoReleases(owner, repo)
      .then((data) => {
        if (!cancelled) setReleases(data);
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

  if (loading) {
    return (
      <div className="flex justify-center py-16 text-slate-400 dark:text-slate-500">
        <RefreshCw size={18} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-sm text-red-500">
        <AlertCircle size={16} />
        <span>{error}</span>
      </div>
    );
  }

  if (releases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-slate-400 dark:text-slate-500">
        <PackageCheck size={36} className="opacity-40" />
        <p className="text-sm font-medium">Belum ada rilis resmi (releases) pada repository ini.</p>
        <p className="text-xs">Kamu dapat memantau commit dan branches untuk pembaruan kode.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 p-6 space-y-6 dark:divide-slate-800">
      {releases.map((rel, idx) => (
        <div key={rel.id} className="pt-6 first:pt-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 font-mono text-xs font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                  <Tag size={12} />
                  {rel.tag_name}
                </span>

                {idx === 0 && (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                    Latest
                  </span>
                )}

                {rel.prerelease && (
                  <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
                    Pre-release
                  </span>
                )}
              </div>

              <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                <a
                  href={rel.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {rel.name || rel.tag_name}
                </a>
              </h3>

              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                {rel.author && (
                  <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-400">
                    <img
                      src={rel.author.avatar_url}
                      alt={rel.author.login}
                      className="h-4 w-4 rounded-full"
                    />
                    {rel.author.login}
                  </span>
                )}
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {formatDate(rel.published_at)} ({timeAgo(rel.published_at)})
                </span>
              </div>
            </div>

            <a
              href={rel.html_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <span>GitHub</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Release Notes */}
          {rel.body && (
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-700 whitespace-pre-wrap dark:bg-slate-800/60 dark:text-slate-300">
              {rel.body}
            </div>
          )}

          {/* Assets */}
          {rel.assets.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Assets ({rel.assets.length})
              </h4>
              <ul className="space-y-1.5">
                {rel.assets.map((asset) => (
                  <li
                    key={asset.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-white p-2.5 text-xs dark:border-slate-800 dark:bg-slate-900"
                  >
                    <a
                      href={asset.browser_download_url}
                      className="flex min-w-0 items-center gap-2 font-medium text-indigo-600 hover:underline dark:text-indigo-400 truncate"
                    >
                      <FileArchive size={14} className="shrink-0 text-slate-400" />
                      <span className="truncate">{asset.name}</span>
                    </a>
                    <div className="flex shrink-0 items-center gap-3 text-slate-400 dark:text-slate-500">
                      <span>{(asset.size / (1024 * 1024)).toFixed(2)} MB</span>
                      <span className="flex items-center gap-1">
                        <Download size={11} /> {asset.download_count}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
