import React from "react"
import { cn } from "@/utils/cn"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost"
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50 min-h-[44px] px-6 py-2.5",
          variant === "primary" && "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
          variant === "secondary" && "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50",
          variant === "danger" && "bg-red-600 text-white hover:bg-red-500 shadow-sm",
          variant === "ghost" && "text-slate-600 hover:bg-slate-100",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"
