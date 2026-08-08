import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, GitFork, ChevronRight } from "lucide-react";
import type { GithubRepo } from "../lib/github";
import { formatCount, languageColor } from "../lib/format";

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function RepoResultCard({ repo }: { repo: GithubRepo }) {
  return (
    <motion.div variants={itemVariants}>
      <Link
        to={`/repositories/${repo.full_name}`}
        className="group flex items-center gap-4 border-b border-slate-100 px-6 py-4 transition-colors last:border-b-0 hover:bg-slate-50/70 sm:px-8 dark:border-slate-800 dark:hover:bg-slate-800/40"
      >
        <img
          src={repo.owner?.avatar_url}
          alt={repo.owner?.login}
          className="h-11 w-11 shrink-0 rounded-full ring-1 ring-slate-200 dark:ring-slate-700"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-slate-800 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
            {repo.full_name}
          </p>
          <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">
            {repo.description || "No description"}
          </p>
          {repo.language && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: languageColor(repo.language) }}
              />
              {repo.language}
            </p>
          )}
        </div>
        <div className="hidden shrink-0 items-center gap-4 text-sm text-slate-500 sm:flex dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Star size={14} /> {formatCount(repo.stargazers_count)}
          </span>
          <span className="flex items-center gap-1.5">
            <GitFork size={14} /> {formatCount(repo.forks_count)}
          </span>
        </div>
        <ChevronRight size={18} className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 dark:text-slate-600" />
      </Link>
    </motion.div>
  );
}
