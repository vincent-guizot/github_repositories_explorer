import { RefreshCw } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-32 text-slate-400 dark:text-slate-500">
      <RefreshCw size={20} className="animate-spin" />
    </div>
  );
}
