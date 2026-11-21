import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Download,
  RefreshCw,
  FileCode,
  AlertCircle,
  FileText,
} from "lucide-react";
import { getFileContent, type GithubContentItem, type GithubFileContent } from "../lib/github";

export default function CodeViewerModal({
  owner,
  repo,
  item,
  onClose,
}: {
  owner: string;
  repo: string;
  item: GithubContentItem | null;
  onClose: () => void;
}) {
  const [fileData, setFileData] = useState<GithubFileContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!item) {
      setFileData(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    getFileContent(owner, repo, item.path)
      .then((data) => {
        if (!cancelled) setFileData(data);
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
  }, [owner, repo, item]);

  // Handle ESC key to close
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const lines = useMemo(() => {
    if (!fileData?.content) return [];
    return fileData.content.split("\n");
  }, [fileData?.content]);

  const isImage = useMemo(() => {
    if (!item) return false;
    const ext = item.name.split(".").pop()?.toLowerCase();
    return ["png", "jpg", "jpeg", "gif", "svg", "webp", "ico"].includes(ext || "");
  }, [item]);

  const handleCopy = () => {
    if (!fileData?.content) return;
    navigator.clipboard.writeText(fileData.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col h-[85vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        >
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-800/50">
            <div className="flex min-w-0 items-center gap-2">
              <FileCode size={18} className="text-indigo-500 shrink-0" />
              <div className="min-w-0">
                <p className="truncate font-semibold text-sm text-slate-800 dark:text-slate-100">
                  {item.path}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {(item.size / 1024).toFixed(1)} KB {lines.length > 0 && `• ${lines.length} lines`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {fileData?.content && !fileData.isBinary && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              )}

              {fileData?.downloadUrl && (
                <a
                  href={fileData.downloadUrl}
                  download={item.name}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <Download size={13} />
                  <span>Download</span>
                </a>
              )}

              <a
                href={item.html_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <ExternalLink size={13} />
                <span className="hidden sm:inline">GitHub</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-200/60 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="relative flex-1 overflow-auto bg-white p-0 dark:bg-slate-950 font-mono text-xs">
            {loading && (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-500">
                <RefreshCw size={24} className="animate-spin text-indigo-500" />
                <p className="text-sm font-sans">Memuat isi berkas...</p>
              </div>
            )}

            {!loading && error && (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center p-6 text-red-500 font-sans">
                <AlertCircle size={28} />
                <p className="text-sm font-medium">{error}</p>
                <a
                  href={item.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 text-xs text-indigo-600 underline dark:text-indigo-400"
                >
                  Buka langsung di GitHub
                </a>
              </div>
            )}

            {!loading && !error && isImage && (
              <div className="flex h-full flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/40">
                <img
                  src={fileData?.downloadUrl || `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${item.path}`}
                  alt={item.name}
                  className="max-h-[60vh] max-w-full rounded-lg object-contain shadow-md"
                />
              </div>
            )}

            {!loading && !error && !isImage && fileData?.isBinary && (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center font-sans text-slate-500 dark:text-slate-400">
                <FileText size={36} className="text-slate-400" />
                <p className="text-sm font-medium">Berkas biner tidak dapat ditampilkan langsung.</p>
                {fileData.downloadUrl && (
                  <a
                    href={fileData.downloadUrl}
                    download={item.name}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700"
                  >
                    <Download size={14} />
                    Unduh Berkas ({((item.size || 0) / 1024).toFixed(1)} KB)
                  </a>
                )}
              </div>
            )}

            {!loading && !error && !isImage && !fileData?.isBinary && lines.length > 0 && (
              <div className="flex min-w-full">
                {/* Line Numbers */}
                <div className="sticky left-0 select-none border-r border-slate-100 bg-slate-50/70 py-4 px-3 text-right text-slate-400 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-600">
                  {lines.map((_, i) => (
                    <div key={i} className="leading-5">
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* Code Content */}
                <pre className="flex-1 overflow-x-auto py-4 px-4 leading-5 text-slate-800 dark:text-slate-200">
                  {lines.map((line, i) => (
                    <div key={i} className="whitespace-pre">
                      {line || "\n"}
                    </div>
                  ))}
                </pre>
              </div>
            )}

            {!loading && !error && !isImage && !fileData?.isBinary && lines.length === 0 && (
              <div className="flex h-full items-center justify-center text-slate-400 font-sans text-sm">
                Berkas ini kosong.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
