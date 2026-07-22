"use client"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Logo } from "@/components/Logo"
import { Badge } from "@/components/ui/Badge"
import { playChime } from "@/utils/audio"
import { Clock, Sparkles, RefreshCw, ShoppingBag } from "lucide-react"

export interface TicketStubProps {
  number: number
  customerName: string
  merchantName: string
  note?: string
  status: "waiting" | "preparing" | "ready" | "done" | "serving"
  estimatedMinutes?: number
  onReset?: () => void
}

export function TicketStub({
  number,
  customerName,
  merchantName,
  note,
  status,
  estimatedMinutes = 5,
  onReset,
}: TicketStubProps) {
  const [prevStatus, setPrevStatus] = useState(status)

  useEffect(() => {
    if (status !== prevStatus) {
      if (status === "ready" || status === "serving") {
        playChime("ready")
      } else if (status === "preparing") {
        playChime("success")
      }
      setPrevStatus(status)
    }
  }, [status, prevStatus])

  const formattedNumber = String(number).padStart(3, "0")

  const getStatusBadge = () => {
    switch (status) {
      case "waiting":
        return <Badge variant="waiting">Dalam Antrean</Badge>
      case "preparing":
      case "serving":
        return <Badge variant="preparing" pulse>Sedang Disiapkan</Badge>
      case "ready":
        return <Badge variant="ready" pulse>Siap Diambil!</Badge>
      case "done":
        return <Badge variant="done">Selesai</Badge>
      default:
        return <Badge variant="neutral">Antrean Active</Badge>
    }
  }

  return (
    <motion.div
      initial={{ scale: 0.94, opacity: 0, y: 12 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.94, opacity: 0, y: -12 }}
      transition={{ type: "spring", stiffness: 500, damping: 26, mass: 0.6 }}
      className="relative w-full max-w-[360px] sm:max-w-sm mx-auto select-none smooth-gpu px-1"
    >
      {/* Outer Glowing Border */}
      <div
        className={`absolute -inset-1 rounded-[2.25rem] sm:rounded-[2.5rem] blur-xl opacity-40 transition-all duration-300 ${
          status === "ready"
            ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 animate-pulse"
            : status === "preparing"
            ? "bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600"
            : "bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900"
        }`}
      />

      {/* Main Ticket Surface */}
      <div className="relative rounded-[2rem] sm:rounded-[2.25rem] border border-white/15 bg-gradient-to-b from-slate-900/95 to-slate-950/95 p-5 sm:p-6 shadow-2xl backdrop-blur-2xl overflow-hidden">
        {/* Ticket Perforated Cut-Outs */}
        <div className="ticket-tear-left border-r border-white/10" />
        <div className="ticket-tear-right border-l border-white/10" />

        {/* Header Section with Logo */}
        <div className="flex items-center justify-between border-b border-dashed border-white/15 pb-4">
          <Logo size="sm" showText={false} />
          <span className="text-xs font-bold text-white tracking-wide truncate max-w-[180px] text-right">
            {merchantName}
          </span>
        </div>

        {/* Center Display: Number, Name & Order Note */}
        <div className="py-6 sm:py-7 text-center space-y-3">
          <p className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">Nomor Antrean Anda</p>

          <motion.div
            key={formattedNumber}
            initial={{ scale: 0.85, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 600, damping: 22 }}
            className="my-1 font-mono text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.2)] leading-none"
          >
            <span className="text-emerald-400 font-sans text-4xl sm:text-5xl mr-1">#</span>
            {formattedNumber}
          </motion.div>

          <div className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3.5 py-1.5 border border-white/10 max-w-full">
            <span className="text-xs text-slate-400 shrink-0">Atas Nama:</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-300 truncate">{customerName}</span>
          </div>

          {note && (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-xs text-emerald-200 font-medium text-left flex items-start gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block font-bold">Pesanan Anda:</span>
                <p className="text-xs text-white font-semibold leading-snug">{note}</p>
              </div>
            </div>
          )}
        </div>

        {/* Dashed Tear Line */}
        <div className="relative my-2 h-[1px] w-full border-t border-dashed border-white/20">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-slate-900 px-2.5 text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-slate-500 whitespace-nowrap">
            SOBEK DI SINI
          </div>
        </div>

        {/* Footer Section: Status & Estimasi */}
        <div className="pt-4 sm:pt-5 flex flex-col items-center gap-3.5 text-center">
          <div>{getStatusBadge()}</div>

          {status === "waiting" && (
            <p className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              Estimasi tunggu: ~{estimatedMinutes} menit lagi
            </p>
          )}

          {status === "preparing" && (
            <p className="flex items-center gap-1.5 text-xs text-amber-300 font-medium animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              Pesanan sedang diracik oleh tim toko
            </p>
          )}

          {status === "ready" && (
            <div className="rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-3 text-xs text-emerald-200 font-semibold w-full">
              🎉 Silakan menuju meja kasir / pengambilan!
            </div>
          )}

          {/* Barcode Visual representation */}
          <div className="mt-1 flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity w-full overflow-hidden">
            <div className="flex gap-1 h-6 sm:h-7 items-center justify-center w-full">
              {[3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 6].map((w, i) => (
                <div key={i} className="bg-white/80 rounded-full shrink-0" style={{ width: `${Math.max(1, w - 0.5)}px`, height: "100%" }} />
              ))}
            </div>
            <span className="font-mono text-[9px] text-slate-500 tracking-widest">Q-LITE-{formattedNumber}-VERIFIED</span>
          </div>

          {onReset && (
            <button
              onClick={onReset}
              className="mt-1 flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-lg bg-white/5"
            >
              <RefreshCw className="w-3 h-3" /> Ambil Nomor Baru
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
