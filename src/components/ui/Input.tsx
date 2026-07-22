"use client"
import React from "react"
import { cn } from "@/utils/cn"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-13 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-base md:text-sm text-slate-100 placeholder:text-slate-500 backdrop-blur-md outline-none transition-all duration-150 focus:border-emerald-500/60 focus:bg-slate-900/90 focus:ring-4 focus:ring-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation",
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
