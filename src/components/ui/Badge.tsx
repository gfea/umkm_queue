import { cn } from "@/utils/cn"

export type BadgeVariant = "waiting" | "preparing" | "ready" | "serving" | "done" | "neutral" | "active" | "suspended"

export function Badge({ variant = "neutral", children, pulse = true }: { variant?: BadgeVariant; children: React.ReactNode; pulse?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide transition-all duration-200 backdrop-blur-md",
        (variant === "waiting" || variant === "neutral") && "border-slate-700/60 bg-slate-800/60 text-slate-300",
        (variant === "preparing" || variant === "serving") && "border-amber-500/40 bg-amber-500/10 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
        (variant === "ready" || variant === "done" || variant === "active") && "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
        variant === "suspended" && "border-rose-500/40 bg-rose-500/10 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.2)]"
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          (variant === "waiting" || variant === "neutral") && "bg-slate-400",
          (variant === "preparing" || variant === "serving") && "bg-amber-400",
          (variant === "ready" || variant === "done" || variant === "active") && "bg-emerald-400",
          variant === "suspended" && "bg-rose-400",
          pulse && "animate-pulse"
        )}
      />
      {children}
    </span>
  )
}
