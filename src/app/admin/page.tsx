"use client"
import React, { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { buildQueueUrl, normalizeSlug } from "@/lib/domain.mjs"
import { Merchant, QueueTicket, store } from "@/lib/store"
import { Logo } from "@/components/Logo"
import { InstantQrCode } from "@/components/InstantQrCode"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { motion, AnimatePresence } from "framer-motion"
import {
  Store,
  Plus,
  QrCode,
  LogOut,
  Users,
  CheckCircle,
  ExternalLink,
  X,
  Copy,
  Check,
  ShoppingBag,
} from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [tickets, setTickets] = useState<QueueTicket[]>([])
  const [businessName, setBusinessName] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [email, setEmail] = useState("")
  const [err, setErr] = useState("")
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null)
  const [activeQrUrl, setActiveQrUrl] = useState<{ name: string; url: string } | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!store.signedIn()) {
      router.replace("/admin/login")
      return
    }
    const timeout = window.setTimeout(() => {
      setMerchants(store.merchants())
      setTickets(store.tickets())
    }, 0)
    return () => window.clearTimeout(timeout)
  }, [router])

  // Periodic state refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setMerchants(store.merchants())
      setTickets(store.tickets())
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  const pendingTickets = useMemo(
    () => tickets.filter((t) => t.status !== "done"),
    [tickets]
  )

  const activeMerchant = useMemo(
    () => merchants.find((m) => m.id === selectedMerchantId) || merchants[0] || null,
    [merchants, selectedMerchantId]
  )

  const activeMerchantTickets = useMemo(() => {
    if (!activeMerchant) return []
    return tickets.filter((t) => t.merchantId === activeMerchant.id)
  }, [tickets, activeMerchant])

  async function handleAddMerchant(e: React.FormEvent) {
    e.preventDefault()
    setErr("")
    try {
      const slug = normalizeSlug(businessName)
      const item = await store.addMerchantAsync({ businessName, ownerName, email, slug })
      setMerchants(store.merchants())
      setBusinessName("")
      setOwnerName("")
      setEmail("")
      setSelectedMerchantId(item.id)
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Gagal menambah UMKM")
    }
  }

  function toggleStatus(id: string) {
    const updated = store.toggleMerchant(id)
    setMerchants(updated)
  }

  function advanceTicketStatus(ticketId: string, currentStatus: "waiting" | "preparing" | "serving" | "done") {
    let nextStatus: "waiting" | "preparing" | "serving" | "done" = "done"
    if (currentStatus === "waiting") nextStatus = "preparing"
    else if (currentStatus === "preparing") nextStatus = "serving"
    else if (currentStatus === "serving") nextStatus = "done"

    const currentTickets = store.tickets()
    const updated = currentTickets.map((t) => (t.id === ticketId ? { ...t, status: nextStatus } : t))
    if (typeof window !== "undefined") {
      localStorage.setItem("qlite_tickets", JSON.stringify(updated))
    }
    setTickets(updated)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 p-4 md:p-8 bg-mesh-gradient">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header with Logo */}
        <header className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-white/10">
          <Logo size="lg" subtext="q-lite.gfea.my.id · ADMIN PANEL" />
          <Button
            variant="glass"
            size="sm"
            onClick={() => {
              store.logout()
              router.push("/admin/login")
            }}
          >
            <LogOut className="w-3.5 h-3.5 mr-1" /> Keluar
          </Button>
        </header>

        {/* Metrics Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-6 border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Total UMKM Terdaftar</span>
              <Store className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="mt-3 text-3xl font-black font-mono text-white">{merchants.length}</div>
          </Card>

          <Card className="p-6 border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">UMKM Aktif Berjalan</span>
              <CheckCircle className="w-5 h-5 text-teal-400" />
            </div>
            <div className="mt-3 text-3xl font-black font-mono text-emerald-400">
              {merchants.filter((m) => m.status === "active").length}
            </div>
          </Card>

          <Card className="p-6 border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Antrean Sedang Berjalan</span>
              <Users className="w-5 h-5 text-amber-400" />
            </div>
            <div className="mt-3 text-3xl font-black font-mono text-amber-400">{pendingTickets.length}</div>
          </Card>
        </section>

        {/* Main 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side: Merchant Selector & Register Form */}
          <div className="lg:col-span-5 space-y-6">
            {/* Form Register Merchant */}
            <Card className="p-6 space-y-4 border-white/10">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" /> Daftarkan UMKM Baru
              </h2>
              <form onSubmit={handleAddMerchant} className="space-y-3">
                <Input
                  placeholder="Nama toko (contoh: Kedai Kopi Pagi)"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
                <Input
                  placeholder="Nama pemilik toko"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email kontak pemilik"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {err && <p className="text-xs font-bold text-rose-400">{err}</p>}
                <Button type="submit" variant="emerald" className="w-full">
                  + Tambah Toko Baru
                </Button>
              </form>
            </Card>

            {/* List of Merchants */}
            <div className="space-y-3">
              <h2 className="text-sm font-mono uppercase text-slate-400 tracking-widest">Daftar Toko & QR</h2>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {merchants.map((m) => {
                  const queueUrl = buildQueueUrl("https://q-lite.gfea.my.id", m.slug)
                  const isSelected = activeMerchant?.id === m.id

                  return (
                    <motion.div
                      key={m.id}
                      onClick={() => setSelectedMerchantId(m.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-slate-900 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                          : "bg-slate-950/60 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white text-base">{m.businessName}</h3>
                            <Badge variant={m.status === "active" ? "active" : "suspended"}>
                              {m.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            {m.ownerName} · {m.email}
                          </p>
                          <a
                            href={queueUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:underline mt-2 font-mono"
                          >
                            q-lite.gfea.my.id/q/{m.slug} <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveQrUrl({ name: m.businessName, url: queueUrl })
                            }}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                            title="Lihat QR Code"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>

                          <Button
                            variant={m.status === "active" ? "danger" : "secondary"}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleStatus(m.id)
                            }}
                          >
                            {m.status === "active" ? "Suspend" : "Aktifkan"}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Side: Kanban Queue Controls for Selected Merchant */}
          <div className="lg:col-span-7">
            {activeMerchant ? (
              <Card className="p-6 border-white/10 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block">
                      LIVE KANBAN KASIR
                    </span>
                    <h2 className="text-2xl font-black text-white">{activeMerchant.businessName}</h2>
                  </div>
                  <a
                    href={buildQueueUrl("https://q-lite.gfea.my.id", activeMerchant.slug)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="glass" size="sm">
                      Buka Tampilan Pembeli <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </a>
                </div>

                {/* Kanban Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Column 1: Menunggu */}
                  <div className="rounded-2xl bg-slate-950/80 p-4 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="text-xs font-bold text-slate-300">Menunggu</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-xs font-mono text-slate-300">
                        {activeMerchantTickets.filter((t) => t.status === "waiting").length}
                      </span>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                      {activeMerchantTickets.filter((t) => t.status === "waiting").length === 0 ? (
                        <p className="text-xs text-slate-500 py-6 text-center">Tidak ada antrean menunggu</p>
                      ) : (
                        activeMerchantTickets
                          .filter((t) => t.status === "waiting")
                          .map((t) => (
                            <div
                              key={t.id}
                              className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold text-emerald-400 text-base">
                                  #{String(t.number).padStart(3, "0")}
                                </span>
                                <span className="text-xs font-bold text-white">{t.customerName}</span>
                              </div>
                              {t.note && (
                                <p className="text-[11px] text-amber-300 bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20 flex items-center gap-1 font-medium">
                                  <ShoppingBag className="w-3 h-3 text-amber-400 shrink-0" /> {t.note}
                                </p>
                              )}
                              <Button
                                variant="emerald"
                                size="sm"
                                className="w-full text-xs font-bold"
                                onClick={() => advanceTicketStatus(t.id, t.status)}
                              >
                                Proses →
                              </Button>
                            </div>
                          ))
                      )}
                    </div>
                  </div>

                  {/* Column 2: Sedang Disiapkan */}
                  <div className="rounded-2xl bg-amber-500/10 p-4 border border-amber-500/20 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-amber-500/20 text-amber-300">
                      <span className="text-xs font-bold">Sedang Disiapkan</span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-xs font-mono">
                        {activeMerchantTickets.filter((t) => t.status === "preparing").length}
                      </span>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                      {activeMerchantTickets.filter((t) => t.status === "preparing").length === 0 ? (
                        <p className="text-xs text-amber-300/50 py-6 text-center">Belum ada pesanan disiapkan</p>
                      ) : (
                        activeMerchantTickets
                          .filter((t) => t.status === "preparing")
                          .map((t) => (
                            <div
                              key={t.id}
                              className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 space-y-2 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold text-amber-400 text-base">
                                  #{String(t.number).padStart(3, "0")}
                                </span>
                                <span className="text-xs font-bold text-white">{t.customerName}</span>
                              </div>
                              {t.note && (
                                <p className="text-[11px] text-amber-300 bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20 flex items-center gap-1 font-medium">
                                  <ShoppingBag className="w-3 h-3 text-amber-400 shrink-0" /> {t.note}
                                </p>
                              )}
                              <Button
                                variant="amber"
                                size="sm"
                                className="w-full text-xs font-bold"
                                onClick={() => advanceTicketStatus(t.id, t.status)}
                              >
                                Panggil 🔔
                              </Button>
                            </div>
                          ))
                      )}
                    </div>
                  </div>

                  {/* Column 3: Ready / Selesai */}
                  <div className="rounded-2xl bg-emerald-500/10 p-4 border border-emerald-500/20 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20 text-emerald-300">
                      <span className="text-xs font-bold">Siap / Selesai</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-xs font-mono">
                        {
                          activeMerchantTickets.filter(
                            (t) => t.status === "serving" || t.status === "done"
                          ).length
                        }
                      </span>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                      {activeMerchantTickets.filter(
                        (t) => t.status === "serving" || t.status === "done"
                      ).length === 0 ? (
                        <p className="text-xs text-emerald-300/50 py-6 text-center">Belum ada pesanan selesai</p>
                      ) : (
                        activeMerchantTickets
                          .filter((t) => t.status === "serving" || t.status === "done")
                          .map((t) => (
                            <div
                              key={t.id}
                              className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold text-emerald-400 text-base">
                                  #{String(t.number).padStart(3, "0")}
                                </span>
                                <span className="text-xs font-bold text-white">{t.customerName}</span>
                              </div>
                              {t.note && (
                                <p className="text-[11px] text-emerald-300 bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1 font-medium">
                                  <ShoppingBag className="w-3 h-3 text-emerald-400 shrink-0" /> {t.note}
                                </p>
                              )}
                              <div className="text-[10px] text-emerald-300 font-mono flex items-center justify-between">
                                <span>Status: {t.status === "serving" ? "Dipanggil" : "Selesai"}</span>
                                {t.status === "serving" && (
                                  <button
                                    onClick={() => advanceTicketStatus(t.id, t.status)}
                                    className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
                                  >
                                    Tandai Done ✓
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center text-slate-500 border-white/10">
                Pilih atau daftarkan toko untuk mulai mengelola antrean.
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Modal QR Code Code View */}
      <AnimatePresence>
        {activeQrUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setActiveQrUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-[2.25rem] border border-white/15 bg-slate-900 p-6 text-center shadow-2xl space-y-5"
            >
              <button
                onClick={() => setActiveQrUrl(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block">
                INSTANT QR CODE
              </span>
              <h3 className="text-xl font-bold text-white">{activeQrUrl.name}</h3>

              <div className="flex justify-center mx-auto">
                <InstantQrCode value={activeQrUrl.url} size={220} />
              </div>

              <div className="space-y-2">
                <p className="text-xs text-slate-400">Tempel QR ini di meja kasir toko Anda.</p>
                <button
                  onClick={() => copyToClipboard(activeQrUrl.url)}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-emerald-300 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Tautan Tersalin!" : "Salin Tautan QR"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
