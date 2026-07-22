"use client"
import React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/utils/cn"
import { playChime } from "@/utils/audio"

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "emerald" | "amber" | "danger" | "ghost" | "glass"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  children?: React.ReactNode
  soundOnClick?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      disabled,
      soundOnClick = true,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (soundOnClick && !disabled && !isLoading) {
        playChime("click")
      }
      onClick?.(e)
    }

    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.025, y: disabled ? 0 : -1.5 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.96 }}
        transition={{ type: "spring", stiffness: 550, damping: 28, mass: 0.5 }}
        onClick={handleClick}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold tracking-wide transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-[#090b10] disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none overflow-hidden touch-manipulation smooth-gpu",
          
          size === "sm" && "min-h-[40px] px-4 text-xs rounded-xl",
          size === "md" && "min-h-[48px] px-5 text-sm rounded-xl",
          size === "lg" && "min-h-[54px] px-7 text-base rounded-2xl font-bold",

          variant === "primary" &&
            "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-950 hover:from-white hover:to-slate-100 shadow-[0_0_20px_rgba(255,255,255,0.15)] border border-white/40",
          
          variant === "emerald" &&
            "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.35)] border border-emerald-400/40",

          variant === "amber" &&
            "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.35)] border border-amber-300/40 font-bold",

          variant === "secondary" &&
            "bg-slate-900/90 text-slate-200 border border-slate-800 hover:bg-slate-800 hover:text-white hover:border-slate-700 shadow-sm",

          variant === "glass" &&
            "bg-white/10 text-white border border-white/15 backdrop-blur-md hover:bg-white/20 hover:border-white/25 shadow-lg",

          variant === "danger" &&
            "bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-500 hover:to-red-500 shadow-[0_0_20px_rgba(225,29,72,0.3)] border border-rose-500/40",

          variant === "ghost" &&
            "text-slate-400 hover:text-white hover:bg-white/5",

          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </motion.button>
    )
  }
)
Button.displayName = "Button"
