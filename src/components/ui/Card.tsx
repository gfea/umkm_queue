"use client"
import React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/utils/cn"

export interface CardProps extends HTMLMotionProps<"div"> {
  hoverEffect?: boolean
  glass?: boolean
}

export function Card({ className, hoverEffect = false, glass = true, children, ...props }: CardProps) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -3, transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] } } : undefined}
      className={cn(
        "relative rounded-3xl border transition-all duration-200 ease-out overflow-hidden smooth-gpu",
        glass
          ? "bg-slate-900/60 backdrop-blur-xl border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
          : "bg-slate-900 border-slate-800 shadow-xl",
        hoverEffect && "hover:border-emerald-500/40 hover:shadow-[0_16px_50px_rgba(16,185,129,0.18)]",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pb-3", className)} {...props} />
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0 flex items-center justify-between border-t border-white/5 mt-4", className)} {...props} />
}
