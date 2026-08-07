import type { ReactNode } from "react";

export default function StatCard({
  icon,
  value,
  label,
  tint,
}: {
  icon: ReactNode;
  value: string | number;
  label: string;
  tint: "indigo" | "green" | "blue" | "amber";
}) {
  const tints: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300",
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
  };

  return (
    <div className="flex items-center gap-3.5 px-6 py-5 sm:px-8">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tints[tint]}`}>
        {icon}
      </span>
      <div>
        <p className="text-2xl font-bold leading-none text-slate-900 dark:text-white">{value}</p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{label}</p>
      </div>
    </div>
  );
}
