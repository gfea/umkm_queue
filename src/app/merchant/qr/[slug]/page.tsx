"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Printer, QrCode, ScanLine, Smartphone, Bell, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { InstantQrCode } from "@/components/InstantQrCode"
import { Logo } from "@/components/Logo"
import { Merchant, store } from "@/lib/store"

export default function MerchantQrPrintPage() {
  const params = useParams<{ slug: string }>()
  const slug = params?.slug
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [origin, setOrigin] = useState("")
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setOrigin(window.location.origin)
      setMerchant(store.merchants().find((item) => item.slug === slug) ?? null)
      setLoaded(true)
    }, 0)
    return () => window.clearTimeout(timeout)
  }, [slug])

  const queueUrl = useMemo(
    () => (merchant && origin ? `${origin}/q/${merchant.slug}` : "https://q-lite.gfea.my.id"),
    [merchant, origin]
  )

  if (!loaded) {
    return <main className="grid min-h-[100dvh] place-items-center bg-[#090b10] text-sm text-slate-400">Menyiapkan poster QR...</main>
  }

  if (!merchant) {
    return (
      <main className="grid min-h-[100dvh] place-items-center bg-[#090b10] p-5 text-center text-slate-300">
        <div className="max-w-sm rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
          <QrCode className="mx-auto mb-4 h-12 w-12 text-slate-500" />
          <h1 className="text-xl font-black text-white">QR toko tidak ditemukan</h1>
          <Link href="/merchant" className="mt-5 inline-block text-sm font-bold text-emerald-400 hover:text-emerald-300">
            Kembali ke dashboard
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[100dvh] bg-[#090b10] bg-mesh-gradient p-4 text-slate-100 md:p-8">
      {/* Full-Color Vibrant Print Stylesheet */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0.8cm;
          }
          body, html {
            background: #ffffff !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          .vibrant-poster {
            background: linear-gradient(135deg, #064e3b 0%, #022c22 40%, #090b10 100%) !important;
            color: #ffffff !important;
            border: 4px solid #10b981 !important;
            border-radius: 2rem !important;
            box-shadow: none !important;
            padding: 2.5rem !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .vibrant-poster * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-title {
            color: #ffffff !important;
          }
          .print-desc {
            color: #e2e8f0 !important;
          }
          .step-card-1 {
            background: #ecfdf5 !important;
            border: 2px solid #10b981 !important;
            color: #065f46 !important;
          }
          .step-card-1 * {
            color: #047857 !important;
          }
          .step-card-2 {
            background: #fff7ed !important;
            border: 2px solid #f59e0b !important;
            color: #9a3412 !important;
          }
          .step-card-2 * {
            color: #c2410c !important;
          }
          .step-card-3 {
            background: #f0fdfa !important;
            border: 2px solid #14b8a6 !important;
            color: #115e59 !important;
          }
          .step-card-3 * {
            color: #0f766e !important;
          }
          .url-box {
            background: #064e3b !important;
            border: 2px solid #34d399 !important;
            color: #a7f3d0 !important;
          }
        }
      `}</style>

      {/* Screen Navigation Controls (Hidden when printing) */}
      <div className="no-print mx-auto mb-6 flex max-w-3xl flex-wrap items-center justify-between gap-3">
        <Link href="/merchant" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard Toko
        </Link>
        <Button variant="emerald" size="lg" className="font-bold shadow-[0_0_25px_rgba(16,185,129,0.4)]" onClick={() => window.print()}>
          <Printer className="h-4.5 w-4.5 mr-1" /> Cetak Poster Warna (Print / PDF)
        </Button>
      </div>

      {/* Full-Color Vibrant Poster Standee */}
      <section className="print-container mx-auto grid max-w-3xl place-items-center">
        <article className="vibrant-poster relative w-full overflow-hidden rounded-[2.5rem] border-2 border-emerald-400/40 bg-gradient-to-br from-slate-950 via-emerald-950/80 to-slate-950 p-6 sm:p-10 shadow-[0_24px_90px_rgba(16,185,129,0.3)] backdrop-blur-2xl space-y-8">
          {/* Ambient Lighting Orbs */}
          <div className="no-print absolute top-0 right-0 h-80 w-80 rounded-full bg-emerald-500/20 blur-[100px] pointer-events-none" />
          <div className="no-print absolute bottom-0 left-0 h-80 w-80 rounded-full bg-amber-500/15 blur-[100px] pointer-events-none" />

          {/* Top Header */}
          <div className="relative flex items-center justify-between border-b border-emerald-500/30 pb-6">
            <Logo size="md" subtext="ANTREAN DIGITAL REAL-TIME" />
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/50 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 px-4 py-2 text-xs font-mono font-black uppercase tracking-widest text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <ScanLine className="h-4 w-4 text-emerald-400 animate-pulse" /> SCAN UNTUK ANTRE
            </div>
          </div>

          {/* Center Content */}
          <div className="relative grid gap-8 md:grid-cols-[1fr_300px] md:items-center">
            {/* Left: Store Title & Vibrant Steps */}
            <div className="space-y-6 text-left">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                  SELAMAT DATANG DI
                </span>
                <h1 className="print-title text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                  {merchant.businessName}
                </h1>
                <p className="print-desc mt-3 text-xs sm:text-sm font-medium leading-relaxed text-slate-200">
                  Pindai QR Code di samping menggunakan kamera HP Anda untuk langsung mendapatkan nomor antrean tanpa perlu download aplikasi!
                </p>
              </div>

              {/* 3 Colorful Step Cards */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2">
                <div className="step-card-1 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-center space-y-1.5 shadow-lg">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                    <ScanLine className="h-4.5 w-4.5" />
                  </div>
                  <span className="font-mono text-xs font-black text-emerald-300 block">1. Scan</span>
                  <p className="text-[10px] font-bold text-emerald-100">Buka Kamera HP</p>
                </div>

                <div className="step-card-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-center space-y-1.5 shadow-lg">
                  <div className="h-8 w-8 rounded-xl bg-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
                    <Smartphone className="h-4.5 w-4.5" />
                  </div>
                  <span className="font-mono text-xs font-black text-amber-300 block">2. Isi Nama</span>
                  <p className="text-[10px] font-bold text-amber-100">Tanpa Login</p>
                </div>

                <div className="step-card-3 rounded-2xl border border-teal-500/30 bg-teal-500/10 p-3.5 text-center space-y-1.5 shadow-lg">
                  <div className="h-8 w-8 rounded-xl bg-teal-500/20 flex items-center justify-center mx-auto text-teal-400">
                    <Bell className="h-4.5 w-4.5" />
                  </div>
                  <span className="font-mono text-xs font-black text-teal-300 block">3. Dipanggil</span>
                  <p className="text-[10px] font-bold text-teal-100">Sound & Getar</p>
                </div>
              </div>
            </div>

            {/* Right: High-Res Instant QR Code */}
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="rounded-[2.25rem] bg-white p-4 shadow-[0_0_40px_rgba(16,185,129,0.3)] border-4 border-emerald-400">
                <InstantQrCode value={queueUrl} size={250} logoOverlay={true} />
              </div>
              <div className="url-box w-full text-center font-mono text-xs font-black text-emerald-300 tracking-wider break-all bg-emerald-950/90 p-3 rounded-2xl border border-emerald-500/40 shadow-lg">
                {queueUrl}
              </div>
            </div>
          </div>

          {/* Footer Branding */}
          <div className="relative pt-6 border-t border-emerald-500/30 flex items-center justify-between text-xs text-slate-300 font-mono font-bold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Diproyeksikan oleh Q-Lite System
            </span>
            <span className="text-emerald-300">q-lite.gfea.my.id</span>
          </div>
        </article>
      </section>
    </main>
  )
}
