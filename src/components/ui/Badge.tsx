import { cn } from "@/utils/cn"

type BadgeVariant = "waiting" | "preparing" | "ready" | "neutral"

export function Badge({ variant = "neutral", children }: { variant?: BadgeVariant; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        variant === "waiting" && "border-slate-200 bg-slate-50 text-slate-600",
        variant === "preparing" && "border-amber-200 bg-amber-50 text-amber-700",
        variant === "ready" && "border-emerald-200 bg-emerald-50 text-emerald-700",
        variant === "neutral" && "border-slate-200 bg-white text-slate-600"
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          variant === "waiting" && "bg-slate-400",
          variant === "preparing" && "bg-amber-500",
          variant === "ready" && "bg-emerald-500",
          variant === "neutral" && "bg-slate-300"
        )}
      />
      {children}
    </span>
  )
}
