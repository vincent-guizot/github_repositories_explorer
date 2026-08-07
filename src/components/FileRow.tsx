import { Folder, FileText } from "lucide-react";
import type { GithubContentItem } from "../lib/github";

export default function FileRow({
  item,
  onOpen,
}: {
  item: GithubContentItem;
  onOpen?: (item: GithubContentItem) => void;
}) {
  const isDir = item.type === "dir";
  return (
    <button
      type="button"
      onClick={() => isDir && onOpen?.(item)}
      disabled={!isDir}
      className={`flex w-full items-center gap-3 border-b border-slate-100 px-5 py-3 text-left text-sm last:border-b-0 dark:border-slate-800 ${
        isDir
          ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
          : "cursor-default"
      }`}
    >
      {isDir ? (
        <Folder size={16} className="shrink-0 text-indigo-400" />
      ) : (
        <FileText size={16} className="shrink-0 text-slate-400" />
      )}
      <span className="truncate text-slate-700 dark:text-slate-200">{item.name}</span>
      {!isDir && (
        <span className="ml-auto shrink-0 text-xs text-slate-400 dark:text-slate-500">
          {(item.size / 1024).toFixed(1)} KB
        </span>
      )}
    </button>
  );
}
