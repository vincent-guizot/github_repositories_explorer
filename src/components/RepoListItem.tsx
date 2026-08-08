import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2, Star, GitFork, Eye, ChevronRight, Lock } from "lucide-react";
import type { GithubRepo } from "../lib/github";
import { timeAgo, formatCount } from "../lib/format";

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function RepoListItem({ repo }: { repo: GithubRepo }) {
  return (
    <motion.div variants={itemVariants}>
      <Link
        to={`/repositories/${repo.full_name}`}
        className="group flex items-center gap-4 border-b border-slate-100 px-6 py-5 transition-colors last:border-b-0 hover:bg-slate-50/70 sm:px-8 dark:border-slate-800 dark:hover:bg-slate-800/40"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-300">
          <Code2 size={17} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 truncate font-semibold text-slate-800 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
            {repo.name}
            {repo.private && <Lock size={12} className="shrink-0 text-slate-400" />}
          </p>
          <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">
            {repo.description || "No description"}
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-5 text-sm text-slate-500 sm:flex dark:text-slate-400">
          <span className="flex w-12 items-center gap-1.5">
            <Star size={14} /> {formatCount(repo.stargazers_count)}
          </span>
          <span className="flex w-12 items-center gap-1.5">
            <GitFork size={14} /> {formatCount(repo.forks_count)}
          </span>
          <span className="flex w-12 items-center gap-1.5">
            <Eye size={14} /> {formatCount(repo.watchers_count)}
          </span>
          <span className="w-28 shrink-0 text-right text-xs text-slate-400 dark:text-slate-500">
            Updated {timeAgo(repo.updated_at)}
          </span>
        </div>

        <ChevronRight size={18} className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 dark:text-slate-600" />
      </Link>
    </motion.div>
  );
}
