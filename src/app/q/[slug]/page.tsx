"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { useParams } from "next/navigation"
import { store, Merchant, QueueTicket } from "@/lib/store"
import { TicketStub } from "@/components/TicketStub"
import { Logo } from "@/components/Logo"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { motion, AnimatePresence } from "framer-motion"
import { Store, AlertTriangle, ArrowRight, Users, ShieldCheck, Sparkles, Volume2, ShoppingBag, User } from "lucide-react"
import { useRealtimeSync } from "@/lib/useRealtimeSync"
import { playChime, haptic, enableNotifications, notifyQueue } from "@/utils/audio"

function getTicketStorageKey(merchantId: string) {
  return `qlite_active_ticket_${merchantId}`
}

function getStoredTicketId(merchantId: string) {
  const key = getTicketStorageKey(merchantId)
  const persistedTicketId = localStorage.getItem(key)
  if (persistedTicketId) return persistedTicketId

  const legacyTicketId = sessionStorage.getItem(key)
  if (legacyTicketId) {
    localStorage.setItem(key, legacyTicketId)
    sessionStorage.removeItem(key)
  }
  return legacyTicketId
}

function persistTicketId(merchantId: string, ticketId: string) {
  localStorage.setItem(getTicketStorageKey(merchantId), ticketId)
}

function clearStoredTicketId(merchantId: string) {
  const key = getTicketStorageKey(merchantId)
  localStorage.removeItem(key)
  sessionStorage.removeItem(key)
}

function findSameTicket(tickets: QueueTicket[], currentTicket: QueueTicket) {
  return tickets.find(
    (ticketItem) => ticketItem.id === currentTicket.id || (
      ticketItem.merchantId === currentTicket.merchantId &&
      ticketItem.number === currentTicket.number &&
      ticketItem.customerName.trim().toLowerCase() === currentTicket.customerName.trim().toLowerCase()
    )
  )
}

export default function QueuePage() {
  const params = useParams<{ slug: string }>()
  const slug = params?.slug

  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [name, setName] = useState("")
  const [note, setNote] = useState("")
  const [ticket, setTicket] = useState<QueueTicket | null>(null)
  const [allTickets, setAllTickets] = useState<QueueTicket[]>([])
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)
  const ticketRef = useRef<QueueTicket | null>(null)

  // Keep ticketRef in sync
  useEffect(() => { ticketRef.current = ticket }, [ticket])

  // Fetch latest data from server
  const fetchLatest = useCallback(async (m: Merchant) => {
    const fresh = await store.fetchTicketsAsync(m.id)
    setAllTickets(fresh)
    const currentTicket = ticketRef.current
    if (currentTicket) {
      const updated = findSameTicket(fresh, currentTicket)
      if (updated) {
        if (currentTicket.status !== updated.status) {
          if (updated.status === "serving") {
            playChime("ready")
            haptic("alert")
            notifyQueue("Nomor antrean dipanggil", `${m.businessName}: nomor ${String(updated.number).padStart(3, "0")} sedang dilayani.`, `qlite-${updated.id}-serving`)
          } else if (updated.status === "done") {
            playChime("success")
            haptic("success")
            notifyQueue("Antrean selesai", `${m.businessName}: nomor ${String(updated.number).padStart(3, "0")} selesai.`, `qlite-${updated.id}-done`)
          }
        }
        persistTicketId(m.id, updated.id)
        setTicket(updated)
      }
    }
  }, [])

  // Initial load
  useEffect(() => {
    if (!slug) return
    const timeout = window.setTimeout(() => {
      store.fetchMerchantsAsync().then((merchants) => {
      const found = merchants.find((m) => m.slug === slug) ?? null
      setMerchant(found)
      if (!found) return

      const initialTickets = store.tickets()
      setAllTickets(initialTickets)

      const savedTicketId = getStoredTicketId(found.id)
      if (savedTicketId) {
        const savedTicket = initialTickets.find((ticketItem) => ticketItem.id === savedTicketId)
        if (savedTicket) setTicket(savedTicket)
      }

      store.fetchTicketsAsync(found.id).then((fresh) => {
        setAllTickets(fresh)
        const currentTicket = ticketRef.current
        if (currentTicket) {
          const updated = findSameTicket(fresh, currentTicket)
          if (updated) {
            persistTicketId(found.id, updated.id)
            setTicket(updated)
            return
          }
        }
        const savedTicketId = getStoredTicketId(found.id)
        if (savedTicketId) {
          const savedTicket = fresh.find((ticketItem) => ticketItem.id === savedTicketId)
          if (savedTicket) setTicket(savedTicket)
        }
      })
      })
    }, 0)
    return () => window.clearTimeout(timeout)
  }, [slug])

  // Connect same-origin SSE push sync; no polling loop.
  useRealtimeSync(merchant?.id, () => {
    if (merchant) fetchLatest(merchant)
  })

  if (!merchant) {
    return (
      <main className="grid min-h-[100dvh] place-items-center bg-[#090b10] px-4 text-slate-400">
        <div className="text-center space-y-4 max-w-sm rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl">
          <Store className="w-12 h-12 text-slate-500 mx-auto" />
          <h1 className="text-xl font-bold text-white">Toko Tidak Ditemukan</h1>
          <p className="text-xs text-slate-400">Tautan QR Code mungkin tidak valid atau toko telah dinonaktifkan.</p>
        </div>
      </main>
    )
  }

  if (merchant.status === "suspended") {
    return (
      <main className="grid min-h-[100dvh] place-items-center bg-[#090b10] px-4 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md rounded-[2.25rem] border border-rose-500/30 bg-slate-900/80 p-6 sm:p-8 shadow-[0_24px_80px_rgba(244,63,94,0.15)] backdrop-blur-2xl space-y-4"
        >
          <div className="h-14 w-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-400">DITANGGUHKAN</span>
          <h1 className="text-2xl font-black text-white">{merchant.businessName}</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Antrean sedang ditutup sementara oleh pengelola toko. Silakan tanyakan ke kasir secara langsung.
          </p>
        </motion.div>
      </main>
    )
  }

  const waitingCount = allTickets.filter(
    (t) => t.merchantId === merchant.id && t.status === "waiting"
  ).length

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || loading || ticket) return
    setErr("")
    setLoading(true)

    // Request notification permission on first user gesture
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        await enableNotifications()
      }
    }

    try {
      const newTicket = await store.joinAsync(merchant.id, name, note)
      setTicket(newTicket)
      setAllTickets((currentTickets) => [
        ...currentTickets.filter((ticketItem) => ticketItem.id !== newTicket.id),
        newTicket,
      ])
      persistTicketId(merchant.id, newTicket.id)
      playChime("success")
      haptic("success")
      notifyQueue("Antrean berhasil diambil", `${merchant.businessName}: nomor Anda ${String(newTicket.number).padStart(3, "0")}.`, `qlite-${newTicket.id}-joined`)
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Gagal masuk antrean")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setTicket(null)
    setNote("")
    if (merchant) clearStoredTicketId(merchant.id)
  }

  return (
    <main className="min-h-[100dvh] relative overflow-hidden bg-[#090b10] text-slate-100 flex flex-col justify-between p-4 sm:p-6 bg-mesh-gradient">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-40" />

      <div className="relative z-10 max-w-md mx-auto w-full flex-1 flex flex-col justify-between py-2 sm:py-4 space-y-6 sm:space-y-8">
        <header className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Logo size="sm" showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight truncate max-w-[200px]">
                  {merchant.businessName}
                </h1>
                <Badge variant="active" pulse>Buka</Badge>
              </div>
              <p className="text-[11px] text-slate-400">Pemilik: {merchant.ownerName}</p>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {!ticket ? (
            <motion.div
              key="queue-form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
              <div className="rounded-[1.75rem] sm:rounded-[2rem] border border-white/10 bg-slate-900/70 p-5 sm:p-6 backdrop-blur-2xl shadow-2xl space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Kondisi Antrean
                  </span>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-400" /> {waitingCount} Menunggu
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-950 p-4 sm:p-5 border border-white/10 text-center space-y-1.5">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Status Saat Ini</p>
                  <div className="font-mono text-4xl sm:text-5xl font-black text-white tracking-tight">
                    {waitingCount > 0 ? `${waitingCount} Antrean` : "Lancar ⚡"}
                  </div>
                  <p className="text-xs text-slate-400">Estimasi tunggu: ~{Math.max(3, waitingCount * 4)} menit</p>
                </div>

                <form onSubmit={handleJoin} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                      <User className="w-3.5 h-3.5 text-emerald-400" /> Nama Panggilan Anda *
                    </label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Rian, Maya, Budi" required disabled={loading} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-400" /> Mau Pesan Apa? (Opsional)
                    </label>
                    <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Contoh: 2 Es Kopi Susu, 1 Roti Bakar" disabled={loading} />
                  </div>
                  {err && <p className="text-xs font-bold text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">{err}</p>}
                  <Button type="submit" variant="emerald" className="w-full font-bold cursor-pointer" size="lg" isLoading={loading}>
                    Ambil Nomor Antrean <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </form>
              </div>

              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 font-medium">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Tanpa APK</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Volume2 className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Getar & Sound Auto</span>
              </div>
            </motion.div>
          ) : (
            <motion.div key="ticket-display" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <TicketStub
                number={ticket.number}
                customerName={ticket.customerName}
                merchantName={merchant.businessName}
                note={ticket.note}
                status={ticket.status}
                estimatedMinutes={Math.max(2, waitingCount * 3)}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="text-center text-[11px] font-mono text-slate-500 pt-2 flex items-center justify-center gap-2">
          <Logo size="sm" showText={false} />
          <span>q-lite.gfea.my.id · Informasi Selalu Terbarui</span>
        </footer>
      </div>
    </main>
  )
}
