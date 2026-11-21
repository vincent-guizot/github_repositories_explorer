import { useState, useRef, useEffect } from "react";
import { Terminal, Copy, Check, Download, ChevronDown, ExternalLink } from "lucide-react";
import type { GithubRepo } from "../lib/github";

type CloneProtocol = "https" | "ssh" | "cli";

export default function CloneDropdown({ repo }: { repo: GithubRepo }) {
  const [open, setOpen] = useState(false);
  const [protocol, setProtocol] = useState<CloneProtocol>("https");
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const getCloneValue = () => {
    switch (protocol) {
      case "https":
        return `https://github.com/${repo.full_name}.git`;
      case "ssh":
        return `git@github.com:${repo.full_name}.git`;
      case "cli":
        return `gh repo clone ${repo.full_name}`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCloneValue());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadZipUrl = `https://github.com/${repo.full_name}/archive/refs/heads/${repo.default_branch}.zip`;

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-transform hover:-translate-y-0.5"
      >
        <Terminal size={15} />
        <span>Code</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl z-50 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Clone Repository
            </span>
            <div className="flex gap-1">
              {(["https", "ssh", "cli"] as CloneProtocol[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProtocol(p)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    protocol === p
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800/80">
            <input
              type="text"
              readOnly
              value={getCloneValue()}
              className="w-full bg-transparent font-mono text-xs text-slate-700 outline-none dark:text-slate-300"
            />
            <button
              type="button"
              onClick={handleCopy}
              title="Copy to clipboard"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </button>
          </div>

          <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
            <a
              href={downloadZipUrl}
              download
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Download size={14} className="text-slate-400" />
              <span>Download ZIP (.zip)</span>
            </a>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ExternalLink size={14} className="text-slate-400" />
              <span>Open on GitHub</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
