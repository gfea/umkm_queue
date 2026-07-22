"use client"
import React from "react"
import { cn } from "@/utils/cn"

export interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  subtext?: string
}

export function Logo({ className, size = "md", showText = true, subtext }: LogoProps) {
  const sizeMap = {
    sm: "h-7 w-7 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  }

  return (
    <div className={cn("inline-flex items-center gap-3 select-none", className)}>
      {/* Simple Geometric Monogram Logo Badge */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-white/15 shadow-[0_0_20px_rgba(16,185,129,0.25)] overflow-hidden shrink-0 group-hover:border-emerald-500/50 transition-all duration-300",
          sizeMap[size]
        )}
      >
        {/* Simple crisp Image Logo fallback + SVG Geometric Q Mark */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.jpg"
          alt="Q-Lite Logo"
          className="h-full w-full object-cover rounded-xl"
        />
        {/* Glowing Emerald Pulse Dot */}
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-400 border border-slate-950 shadow-[0_0_8px_#10b981] animate-pulse" />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-black tracking-tight text-white font-sans text-lg md:text-xl">
              Q-Lite
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
              v2.0
            </span>
          </div>
          {subtext && (
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase -mt-0.5">
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
