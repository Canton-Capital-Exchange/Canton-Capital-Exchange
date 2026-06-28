import type { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from "react";

export function Panel({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`rounded-lg border border-slate-800 bg-slate-950/60 backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-800 px-4 py-3">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">{title}</h2>
        {subtitle && <p className="mt-0.5 text-[11px] text-slate-500">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function Mono({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return <span className={`font-mono tabular-nums ${className}`}>{children}</span>;
}

export function Badge({
  children,
  tone = "neutral",
}: PropsWithChildren<{ tone?: "neutral" | "amber" | "emerald" | "violet" | "rose" }>) {
  const tones: Record<string, string> = {
    neutral: "bg-slate-800 text-slate-300 border-slate-700",
    amber: "bg-amber-950/60 text-amber-300 border-amber-800",
    emerald: "bg-emerald-950/60 text-emerald-300 border-emerald-800",
    violet: "bg-violet-950/60 text-violet-300 border-violet-800",
    rose: "bg-rose-950/60 text-rose-300 border-rose-800",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }>) {
  const variants: Record<string, string> = {
    primary: "bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_0_1px_rgba(139,92,246,0.4)]",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-300 border border-slate-700",
    danger: "bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800",
  };
  return (
    <button
      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function EmptyState({ children }: PropsWithChildren) {
  return (
    <div className="px-4 py-8 text-center text-xs text-slate-600">
      {children}
    </div>
  );
}

export function Field({
  label,
  children,
}: PropsWithChildren<{ label: string }>) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-violet-500 focus:outline-none";
