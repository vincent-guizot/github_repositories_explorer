import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logoIcon from "../assets/logo-icon.png";

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
      <motion.img
        whileHover={{ scale: 1.06, rotate: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        src={logoIcon}
        alt="RepoCheck"
        className="h-9 w-9 rounded-xl shadow-sm shadow-indigo-500/30"
      />
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
