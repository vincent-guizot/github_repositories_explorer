import { useEffect, useState } from "react";
import {
  CircleDot,
  CheckCircle2,
  GitPullRequest,
  MessageSquare,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { getRepoIssues, type GithubIssue } from "../lib/github";
import { timeAgo } from "../lib/format";

type StateFilter = "all" | "open" | "closed";

function getContrastTextColor(hexColor: string) {
  // If hex is 6 chars, calculate brightness
  const hex = hexColor.replace("#", "");
  if (hex.length === 6) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "#0f172a" : "#ffffff";
  }
  return "#0f172a";
}

export default function IssuesPanel({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) {
  const [issues, setIssues] = useState<GithubIssue[]>([]);
  const [filter, setFilter] = useState<StateFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getRepoIssues(owner, repo, filter)
      .then((data) => {
        if (!cancelled) setIssues(data);
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
  }, [owner, repo, filter]);

  return (
    <div>
      {/* Header with state filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/50 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/40">
        <div className="flex items-center gap-1.5">
          {(["all", "open", "closed"] as StateFilter[]).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilter(st)}
              className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                filter === st
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                  : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {st === "open" && <CircleDot size={13} className="text-emerald-400" />}
              {st === "closed" && <CheckCircle2 size={13} className="text-violet-400" />}
              <span>{st}</span>
            </button>
          ))}
        </div>

        <a
          href={`https://github.com/${owner}/${repo}/issues`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <span>View on GitHub</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Content */}
      {loading && (
        <div className="flex justify-center py-16 text-slate-400 dark:text-slate-500">
          <RefreshCw size={18} className="animate-spin text-indigo-500" />
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-red-500">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && issues.length === 0 && (
        <div className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">
          Tidak ada issue atau pull request untuk filter ini.
        </div>
      )}

      {!loading && !error && issues.length > 0 && (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {issues.map((item) => {
            const isPr = !!item.pull_request;
            const isOpen = item.state === "open";

            return (
              <li
                key={item.id}
                className="group flex items-start gap-3.5 px-5 py-4 transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
              >
                {/* State icon */}
                <div className="mt-1 shrink-0">
                  {isPr ? (
                    <GitPullRequest
                      size={17}
                      className={isOpen ? "text-emerald-500" : "text-violet-500"}
                    />
                  ) : isOpen ? (
                    <CircleDot size={17} className="text-emerald-500" />
                  ) : (
                    <CheckCircle2 size={17} className="text-violet-500" />
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={item.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-sm text-slate-800 hover:text-indigo-600 dark:text-slate-100 dark:hover:text-indigo-400 transition-colors"
                    >
                      {item.title}
                    </a>

                    {isPr && (
                      <span className="rounded-md bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                        Pull Request
                      </span>
                    )}

                    {item.labels.map((lbl) => (
                      <span
                        key={lbl.id}
                        style={{
                          backgroundColor: `#${lbl.color}`,
                          color: getContrastTextColor(lbl.color),
                        }}
                        className="rounded-full px-2 py-0.5 text-[10px] font-medium shadow-xs"
                      >
                        {lbl.name}
                      </span>
                    ))}
                  </div>

                  <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                    <span className="font-mono">#{item.number}</span>
                    <span>•</span>
                    {item.user && (
                      <span className="flex items-center gap-1">
                        <img
                          src={item.user.avatar_url}
                          alt={item.user.login}
                          className="h-3.5 w-3.5 rounded-full"
                        />
                        <span className="text-slate-600 dark:text-slate-400 font-medium">
                          {item.user.login}
                        </span>
                      </span>
                    )}
                    <span>•</span>
                    <span>Dibuka {timeAgo(item.created_at)}</span>
                  </p>
                </div>

                {/* Comments count */}
                {item.comments > 0 && (
                  <span className="flex shrink-0 items-center gap-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
                    <MessageSquare size={13} />
                    <span>{item.comments}</span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
