import { Folder, FileText, FileCode2, Image as ImageIcon } from "lucide-react";
import type { GithubContentItem } from "../lib/github";

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (!ext) return <FileText size={16} className="shrink-0 text-slate-400" />;
  if (["png", "jpg", "jpeg", "gif", "svg", "webp", "ico"].includes(ext)) {
    return <ImageIcon size={16} className="shrink-0 text-amber-500 dark:text-amber-400" />;
  }
  if (
    [
      "ts",
      "tsx",
      "js",
      "jsx",
      "json",
      "py",
      "go",
      "rs",
      "java",
      "c",
      "cpp",
      "cs",
      "html",
      "css",
      "scss",
      "md",
      "sh",
      "yaml",
      "yml",
    ].includes(ext)
  ) {
    return <FileCode2 size={16} className="shrink-0 text-indigo-500 dark:text-indigo-400" />;
  }
  return <FileText size={16} className="shrink-0 text-slate-400" />;
}

export default function FileRow({
  item,
  onOpenDir,
  onOpenFile,
  onOpen,
}: {
  item: GithubContentItem;
  onOpenDir?: (item: GithubContentItem) => void;
  onOpenFile?: (item: GithubContentItem) => void;
  onOpen?: (item: GithubContentItem) => void;
}) {
  const isDir = item.type === "dir";

  const handleClick = () => {
    if (isDir) {
      if (onOpenDir) onOpenDir(item);
      else if (onOpen) onOpen(item);
    } else {
      if (onOpenFile) onOpenFile(item);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full items-center gap-3 border-b border-slate-100 px-5 py-3 text-left text-sm last:border-b-0 cursor-pointer transition-colors hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-800/60"
    >
      {isDir ? (
        <Folder size={16} className="shrink-0 text-indigo-500 fill-indigo-100 dark:fill-indigo-900/40" />
      ) : (
        getFileIcon(item.name)
      )}
      <span className="truncate text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400">
        {item.name}
      </span>
      {!isDir && (
        <span className="ml-auto shrink-0 text-xs text-slate-400 dark:text-slate-500 font-mono">
          {(item.size / 1024).toFixed(1)} KB
        </span>
      )}
    </button>
  );
}
