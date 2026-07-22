"use client"
import React, { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { Logo } from "@/components/Logo"
import { Button } from "@/components/ui/Button"
import { ArrowRight, QrCode, Sparkles, ShieldCheck, Zap, Smartphone, ChevronDown } from "lucide-react"

export function ParallaxHero() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Parallax transform layers
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const yCards = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"])
  const rotateCards = useTransform(scrollYProgress, [0, 1], [0, -3])
  const opacityHero = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] flex flex-col justify-center items-center px-4 pt-28 pb-16 overflow-hidden bg-mesh-gradient"
    >
      {/* Background Animated Parallax Light Orbs */}
      <motion.div style={{ y: yBg }} className="pointer-events-none absolute inset-0 z-0 smooth-gpu">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[450px] w-[650px] rounded-full bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-amber-500/15 blur-[120px]" />
        <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-[90px] animate-float" />
        <div className="absolute bottom-20 right-10 h-80 w-80 rounded-full bg-amber-500/10 blur-[100px] animate-float-delayed" />
        <div className="absolute inset-0 bg-grid-pattern opacity-60" />
      </motion.div>

      {/* Main Content Container */}
      <motion.div style={{ opacity: opacityHero }} className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        {/* Logo Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-3 rounded-full bg-slate-900/80 p-2 pr-5 text-xs font-semibold text-emerald-300 border border-white/10 backdrop-blur-md shadow-2xl mx-auto"
        >
          <Logo size="sm" showText={false} />
          <span className="flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            q-lite.gfea.my.id
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-slate-400 font-normal">Pantau Antrean Langsung</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[1.05] text-white"
        >
          Antrean Rapi. <br />
          <span className="text-gradient-emerald">Pelanggan Tenang.</span> Toko Laris.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed"
        >
          Ubah antrean berdesakan menjadi antrean digital modern dalam 2 menit di <strong>q-lite.gfea.my.id</strong>. Pelanggan cukup scan QR Code,
          tanpa download aplikasi, dan memantau giliran langsung dari HP.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <Link href="/admin/login">
            <Button variant="emerald" size="lg" className="shadow-[0_0_30px_rgba(16,185,129,0.35)]">
              Kelola Toko Saya <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link href="/q/kopi-pagi">
            <Button variant="glass" size="lg">
              <QrCode className="w-4 h-4 mr-1 text-emerald-400" /> Coba Halaman Pembeli
            </Button>
          </Link>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium"
        >
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Setup 2 Menit
          </span>
          <span className="h-3 w-[1px] bg-white/10" />
          <span className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> Tanpa Instal App
          </span>
          <span className="h-3 w-[1px] bg-white/10" />
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> Gratis 50 Antrean/Hari
          </span>
        </motion.div>
      </motion.div>

      {/* Floating 3D Parallax Perspective Card Mockup */}
      <motion.div
        style={{ y: yCards, rotateX: rotateCards }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-4xl mx-auto mt-14 perspective-1000"
      >
        <div className="rounded-[2.5rem] border border-white/15 bg-gradient-to-b from-slate-900/80 to-slate-950/90 p-4 md:p-6 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between px-3 pb-3 border-b border-white/10 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="font-mono text-[11px] text-emerald-300">https://q-lite.gfea.my.id/q/kopi-pagi</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" /> Selalu Terbarui
            </span>
          </div>

          {/* Inner Content Grid Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="rounded-2xl bg-white/5 p-4 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-slate-200">Menunggu (3)</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 font-mono text-[10px]">WAIT</span>
              </div>
              <div className="space-y-2 pt-1">
                <div className="rounded-xl bg-slate-900/90 p-3 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">#A-14</span>
                    <p className="text-xs font-semibold text-white">Budi Santoso</p>
                  </div>
                  <span className="text-[10px] px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg">Diproses →</span>
                </div>
                <div className="rounded-xl bg-slate-900/40 p-3 border border-white/5 flex items-center justify-between opacity-70">
                  <div>
                    <span className="text-xs font-mono text-slate-400 font-bold">#A-15</span>
                    <p className="text-xs font-medium text-slate-300">Maya Putri</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-amber-500/10 p-4 border border-amber-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs text-amber-300">
                <span className="font-bold">Sedang Disiapkan (1)</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 font-mono text-[10px] animate-pulse">PREP</span>
              </div>
              <div className="rounded-xl bg-slate-900/90 p-3 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)] flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-amber-400 font-bold">#A-13</span>
                  <p className="text-xs font-semibold text-white">Rian Hidayat</p>
                </div>
                <span className="text-[10px] px-2 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg animate-pulse">Panggil 🔔</span>
              </div>
            </div>

            <div className="rounded-2xl bg-emerald-500/10 p-4 border border-emerald-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs text-emerald-300">
                <span className="font-bold">Siap Diambil (2)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 font-mono text-[10px]">READY</span>
              </div>
              <div className="rounded-xl bg-slate-900/90 p-3 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">#A-12</span>
                  <p className="text-xs font-semibold text-white">Siti Nurhaliza</p>
                </div>
                <span className="text-[10px] px-2 py-1 bg-emerald-500 text-white font-bold rounded-lg">Selesai ✓</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-500 flex flex-col items-center gap-1 text-xs animate-bounce">
        <span>Scroll untuk eksplorasi</span>
        <ChevronDown className="w-4 h-4" />
      </div>
    </section>
  )
}
