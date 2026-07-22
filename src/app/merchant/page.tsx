"use client"

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, CheckCircle2, Clock3, LogOut, Printer, RotateCcw, Users, RefreshCw, ShoppingBag, Zap, Volume2, Keyboard } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Logo } from "@/components/Logo"
import { Merchant, QueueTicket, store } from "@/lib/store"
import { playChime } from "@/utils/audio"
import { useRealtimeSync } from "@/lib/useRealtimeSync"

const ticketStatusLabel: Record<QueueTicket["status"], string> = {
  waiting: "Menunggu",
  preparing: "Diproses",
  serving: "Dipanggil",
  done: "Selesai",
}

export default function MerchantDashboardPage() {
  const router = useRouter()
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const merchantRef = useRef<Merchant | null>(null)
  const [tickets, setTickets] = useState<QueueTicket[]>([])
  const [error, setError] = useState("")
  const [mobileTab, setMobileTab] = useState<"waiting" | "preparing" | "serving">("waiting")
  const [lastSyncTime, setLastSyncTime] = useState<string>("")
  const prevTicketCountRef = useRef<number>(0)
  const pendingUpdatesRef = useRef<Map<string, QueueTicket["status"]>>(new Map())

  // Keep merchantRef in sync
  useEffect(() => {
    merchantRef.current = merchant
  }, [merchant])

  // Fetch fresh data only when same-origin SSE push arrives.
  const fetchLatest = useCallback(async () => {
    const activeMerchant = merchantRef.current || store.merchant()
    if (!activeMerchant) return

    const freshTickets = await store.fetchTicketsAsync(activeMerchant.id)

    // Merge with pending optimistic updates
    const merged = freshTickets.map((t) => {
      const pending = pendingUpdatesRef.current.get(t.id)
      return pending ? { ...t, status: pending } : t
    })

    setTickets(merged)
    setLastSyncTime(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }))

    // Audio chime for new ticket arrival
    const count = merged.filter((t) => t.merchantId === activeMerchant.id).length
    if (prevTicketCountRef.current > 0 && count > prevTicketCountRef.current) {
      playChime("success")
    }
    prevTicketCountRef.current = count
  }, [])

  // Optimistic status update (0ms UI response)
  const changeStatus = useCallback(async (ticket: QueueTicket, status: QueueTicket["status"]) => {
    if (!merchant) return
    setError("")

    if (status === "serving") playChime("ready")
    else if (status === "preparing" || status === "done") playChime("success")

    pendingUpdatesRef.current.set(ticket.id, status)
    setTickets((prev) => prev.map((t) => (t.id === ticket.id ? { ...t, status } : t)))

    try {
      await store.updateTicketStatusAsync(merchant.id, ticket.id, status)
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Gagal memperbarui antrean")
    } finally {
      setTimeout(() => pendingUpdatesRef.current.delete(ticket.id), 3000)
    }
  }, [merchant])

  // Initial load
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      store.fetchMerchantsAsync().then(() => {
      const activeMerchant = store.merchant()
      if (!activeMerchant) {
        router.replace("/merchant/login")
        return
      }
      merchantRef.current = activeMerchant
      setMerchant(activeMerchant)
      fetchLatest()
      })
    }, 0)
    return () => window.clearTimeout(timeout)
  }, [router, fetchLatest])

  // Same-origin SSE push sync; no polling loop.
  useRealtimeSync(merchant?.id, fetchLatest)

  const merchantTickets = useMemo(
    () => tickets.filter((t) => t.merchantId === merchant?.id).sort((a, b) => a.number - b.number),
    [merchant?.id, tickets]
  )
  const waitingTickets = merchantTickets.filter((t) => t.status === "waiting")
  const preparingTickets = merchantTickets.filter((t) => t.status === "preparing")
  const servingTickets = merchantTickets.filter((t) => t.status === "serving")
  const doneTickets = merchantTickets.filter((t) => t.status === "done")
  const calledTickets = useMemo(
    () => [...servingTickets, ...doneTickets].sort((a, b) => b.number - a.number),
    [servingTickets, doneTickets]
  )

  const callNext = useCallback(() => {
    if (servingTickets.length > 0) { playChime("ready"); return }
    const nextTicket = preparingTickets[0] ?? waitingTickets[0]
    if (!nextTicket) { setError("Belum ada antrean yang dapat dipanggil."); return }
    changeStatus(nextTicket, "serving")
  }, [servingTickets, preparingTickets, waitingTickets, changeStatus])

  // Keyboard hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) return
      if (e.code === "Space" || e.code === "Enter") { e.preventDefault(); callNext() }
      else if (e.code === "Digit1" || e.code === "Numpad1") { if (waitingTickets[0]) changeStatus(waitingTickets[0], "preparing") }
      else if (e.code === "Digit2" || e.code === "Numpad2") { if (preparingTickets[0]) changeStatus(preparingTickets[0], "serving") }
      else if (e.code === "Digit3" || e.code === "Numpad3") { if (servingTickets[0]) changeStatus(servingTickets[0], "done") }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [callNext, waitingTickets, preparingTickets, servingTickets, changeStatus])

  function resetQueue() {
    if (!merchant || merchantTickets.length === 0) return
    if (!window.confirm(`Reset seluruh antrean ${merchant.businessName}?`)) return
    setError("")
    setTickets(store.resetQueue(merchant.id))
  }

  async function manualRefresh() {
    await fetchLatest()
  }

  if (!merchant) {
    return <main className="grid min-h-[100dvh] place-items-center bg-[#090b10] text-sm text-slate-400">Memuat dashboard toko...</main>
  }

  return (
    <main className="min-h-[100dvh] bg-[#090b10] bg-mesh-gradient p-3 sm:p-6 pb-24 lg:pb-8 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <Logo size="sm" showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black text-white truncate max-w-[160px] sm:max-w-none">
                  {merchant.businessName}
                </h1>
              </div>
              <p className="text-[11px] text-slate-400">
                Kasir: {merchant.ownerName} {lastSyncTime && <span className="font-mono text-slate-500">• {lastSyncTime}</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={manualRefresh} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link href={`/merchant/qr/${merchant.slug}`} className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-500/20">
              <Printer className="h-4 w-4" /> Cetak QR
            </Link>
            <Button variant="ghost" size="sm" className="min-h-[40px] px-3 text-xs" onClick={() => { store.merchantLogout(); router.push("/merchant/login") }}>
              <LogOut className="h-4 w-4" /> Keluar
            </Button>
          </div>
        </header>

        {/* Keyboard Shortcuts */}
        <div className="hidden sm:flex items-center justify-between gap-2 rounded-2xl bg-white/5 p-3 border border-white/10 text-xs text-slate-300">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <Keyboard className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white uppercase tracking-wider">HOTKEY KASIR:</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="flex items-center gap-1"><kbd className="px-2 py-0.5 rounded bg-slate-800 border border-white/20 text-emerald-300 font-bold">Space</kbd> Panggil</span>
            <span className="flex items-center gap-1"><kbd className="px-2 py-0.5 rounded bg-slate-800 border border-white/20 text-slate-200 font-bold">1</kbd> Proses</span>
            <span className="flex items-center gap-1"><kbd className="px-2 py-0.5 rounded bg-slate-800 border border-white/20 text-amber-300 font-bold">2</kbd> Panggil</span>
            <span className="flex items-center gap-1"><kbd className="px-2 py-0.5 rounded bg-slate-800 border border-white/20 text-teal-300 font-bold">3</kbd> Selesai</span>
          </div>
        </div>

        {/* Metrics */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <Metric icon={Users} label="Total Hari Ini" value={merchantTickets.length} color="text-white" />
          <Metric icon={Clock3} label="Menunggu" value={waitingTickets.length} color="text-slate-300" />
          <Metric icon={Bell} label="Dipanggil" value={servingTickets.length} color="text-amber-400" />
          <Metric icon={CheckCircle2} label="Selesai" value={doneTickets.length} color="text-emerald-400" />
        </section>

        {/* Desktop Controls */}
        <Card className="hidden lg:block border-emerald-500/20 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Panggil Antrean Berikutnya
              </span>
              <p className="mt-0.5 text-sm text-slate-300">Tekan <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono text-xs">Space</kbd> untuk panggil antrean terdepan.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="emerald" size="lg" className="font-bold shadow-[0_0_25px_rgba(16,185,129,0.4)] cursor-pointer" onClick={callNext} disabled={waitingTickets.length + preparingTickets.length === 0 && servingTickets.length === 0}>
                <Bell className="h-4.5 w-4.5 mr-1" /> Panggil [Space] 🔔
              </Button>
              <Button variant="danger" size="sm" className="cursor-pointer" onClick={resetQueue} disabled={merchantTickets.length === 0}>
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
            </div>
          </div>
          {error && <p role="alert" className="mt-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-300">{error}</p>}
        </Card>

        {/* Mobile Tabs */}
        <div className="flex lg:hidden rounded-2xl bg-slate-950/90 p-1 border border-white/10 sticky top-2 z-30 shadow-xl backdrop-blur-md">
          {(["waiting", "preparing", "serving"] as const).map((tab) => {
            const isActive = mobileTab === tab
            const counts = { waiting: waitingTickets.length, preparing: preparingTickets.length, serving: servingTickets.length + doneTickets.length }
            const labels = { waiting: "Menunggu", preparing: "Diproses", serving: "Selesai" }
            const activeStyles = { waiting: "bg-slate-800 text-white border border-white/10", preparing: "bg-amber-500/20 text-amber-300 border border-amber-500/30", serving: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" }
            const badgeStyles = { waiting: "bg-slate-700 text-white", preparing: "bg-amber-500/30 text-amber-300", serving: "bg-emerald-500/30 text-emerald-300" }
            return (
              <button key={tab} onClick={() => setMobileTab(tab)}
                className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-colors text-center flex items-center justify-center gap-1.5 cursor-pointer ${isActive ? `${activeStyles[tab]} shadow-md` : "text-slate-400"}`}
              >
                {labels[tab]} <span className={`h-5 min-w-[20px] rounded-full px-1.5 font-mono text-[10px] flex items-center justify-center ${badgeStyles[tab]}`}>{counts[tab]}</span>
              </button>
            )
          })}
        </div>

        {error && <p role="alert" className="lg:hidden rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-300">{error}</p>}

        {/* Columns */}
        <section className="grid gap-4 lg:grid-cols-3">
          <div className={mobileTab !== "waiting" ? "hidden lg:block" : "block"}>
            <QueueColumn title="Menunggu" tone="slate" tickets={waitingTickets} empty="Belum ada pelanggan menunggu">
              {(ticket) => (
                <Button variant="secondary" size="sm" className="w-full text-xs font-bold cursor-pointer" onClick={() => changeStatus(ticket, "preparing")}>
                  Mulai Proses [1] →
                </Button>
              )}
            </QueueColumn>
          </div>
          <div className={mobileTab !== "preparing" ? "hidden lg:block" : "block"}>
            <QueueColumn title="Sedang Diproses" tone="amber" tickets={preparingTickets} empty="Belum ada pesanan diproses">
              {(ticket) => (
                <Button variant="amber" size="sm" className="w-full text-xs font-bold cursor-pointer" onClick={() => changeStatus(ticket, "serving")}>
                  <Bell className="h-4 w-4" /> Panggil [2] 🔔
                </Button>
              )}
            </QueueColumn>
          </div>
          <div className={mobileTab !== "serving" ? "hidden lg:block" : "block"}>
            <QueueColumn title="Dipanggil / Selesai" tone="emerald" tickets={calledTickets} empty="Belum ada antrean selesai">
              {(ticket) =>
                ticket.status === "serving" ? (
                  <div className="flex gap-2">
                    <Button variant="amber" size="sm" className="flex-1 text-xs font-bold cursor-pointer" onClick={() => playChime("ready")}>
                      <Volume2 className="h-3.5 w-3.5" /> Ulang 🔔
                    </Button>
                    <Button variant="emerald" size="sm" className="flex-1 text-xs font-bold cursor-pointer" onClick={() => changeStatus(ticket, "done")}>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Done [3] ✓
                    </Button>
                  </div>
                ) : null
              }
            </QueueColumn>
          </div>
        </section>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-slate-950/90 border-t border-white/10 backdrop-blur-xl lg:hidden flex items-center justify-between gap-3 shadow-2xl">
        <Button variant="emerald" size="lg" className="flex-1 font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer"
          onClick={callNext} disabled={waitingTickets.length + preparingTickets.length === 0 && servingTickets.length === 0}
        >
          <Bell className="h-4 w-4" /> Panggil Berikutnya
        </Button>
        <button onClick={resetQueue} disabled={merchantTickets.length === 0}
          className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 text-rose-400 hover:bg-rose-500/10 flex items-center justify-center shrink-0 disabled:opacity-40 cursor-pointer"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>
    </main>
  )
}

function Metric({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; color: string }) {
  return (
    <Card className="border-white/10 p-3 sm:p-5">
      <div className="flex items-center justify-between text-xs text-slate-400"><span className="truncate">{label}</span><Icon className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 ${color}`} /></div>
      <strong className={`mt-2 block font-mono text-2xl sm:text-3xl ${color}`}>{value}</strong>
    </Card>
  )
}

function QueueColumn({ title, tone, tickets, empty, children }: { title: string; tone: "slate" | "amber" | "emerald"; tickets: QueueTicket[]; empty: string; children: (ticket: QueueTicket) => React.ReactNode }) {
  const toneClass = tone === "amber" ? "border-amber-500/20 bg-amber-500/5" : tone === "emerald" ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/10 bg-slate-950/70"
  return (
    <div className={`min-h-72 rounded-3xl border p-3.5 sm:p-4 ${toneClass}`}>
      <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
        <h2 className="text-sm font-bold text-white">{title}</h2>
        <span className="rounded-lg bg-white/10 px-2 py-0.5 font-mono text-xs text-slate-300">{tickets.length}</span>
      </div>
      <div className="space-y-3">
        {tickets.length === 0 ? <p className="py-12 text-center text-xs text-slate-500">{empty}</p> : tickets.map((ticket) => (
          <article key={ticket.id} className="rounded-2xl border border-white/10 bg-slate-900 p-3.5 sm:p-4 shadow-lg space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <strong className="font-mono text-2xl text-emerald-400">#{String(ticket.number).padStart(3, "0")}</strong>
                <p className="mt-0.5 text-sm font-bold text-white">{ticket.customerName}</p>
              </div>
              <Badge variant={ticket.status}>{ticketStatusLabel[ticket.status]}</Badge>
            </div>
            {ticket.note && (
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-xs text-amber-200 font-medium flex items-start gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block font-bold">Pesanan:</span>
                  <p className="text-xs text-white font-semibold leading-snug">{ticket.note}</p>
                </div>
              </div>
            )}
            <div>{children(ticket)}</div>
          </article>
        ))}
      </div>
    </div>
  )
}
