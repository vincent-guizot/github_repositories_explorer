import { Link } from "react-router-dom";
import GithubIcon from "./icons/GithubIcon";

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm shadow-indigo-500/30 transition-transform group-hover:scale-105">
        <GithubIcon size={17} />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
            Repo<span className="text-indigo-600 dark:text-indigo-400">Check</span>
          </span>
          <span className="block text-[10.5px] font-medium text-slate-400 dark:text-slate-500">
            GitHub Repository Checker
          </span>
        </span>
      )}
    </Link>
  );
}
