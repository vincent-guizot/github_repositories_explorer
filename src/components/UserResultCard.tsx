import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Building2, User as UserIcon } from "lucide-react";
import type { GithubSearchUser } from "../lib/github";

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function UserResultCard({ user }: { user: GithubSearchUser }) {
  return (
    <motion.div variants={itemVariants}>
      <Link
        to={`/explore/users/${user.login}`}
        className="group flex items-center gap-4 border-b border-slate-100 px-6 py-4 transition-colors last:border-b-0 hover:bg-slate-50/70 sm:px-8 dark:border-slate-800 dark:hover:bg-slate-800/40"
      >
        <img
          src={user.avatar_url}
          alt={user.login}
          className="h-11 w-11 shrink-0 rounded-full ring-1 ring-slate-200 dark:ring-slate-700"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-slate-800 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
            {user.login}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
            {user.type === "Organization" ? <Building2 size={12} /> : <UserIcon size={12} />}
            {user.type === "Organization" ? "Organization" : "User"}
          </p>
        </div>
        <ChevronRight size={18} className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 dark:text-slate-600" />
      </Link>
    </motion.div>
  );
}
