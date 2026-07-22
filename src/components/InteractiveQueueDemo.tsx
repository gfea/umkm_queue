"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TicketStub } from "@/components/TicketStub"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { playChime } from "@/utils/audio"
import { store } from "@/lib/store"
import { Sparkles, ArrowRight, Store, ChefHat, Bell, CheckCircle, ShoppingBag, User } from "lucide-react"

export function InteractiveQueueDemo() {
  const [customerName, setCustomerName] = useState("Rian")
  const [note, setNote] = useState("2 Es Kopi Susu")
  const [ticketNumber, setTicketNumber] = useState(14)
  const [status, setStatus] = useState<"waiting" | "preparing" | "ready" | "done">("waiting")
  const [activeTab, setActiveTab] = useState<"buyer" | "cashier">("buyer")

  const handleTakeTicket = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName.trim()) return
    playChime("success")

    // Add to actual store so merchant page syncs real ticket!
    try {
      const merchants = store.merchants()
      const demoMerchant = merchants.find((m) => m.slug === "kopi-pagi") || merchants[0]
      if (demoMerchant) {
        const ticket = store.join(demoMerchant.id, customerName, note)
        setTicketNumber(ticket.number)
      } else {
        setTicketNumber((prev) => prev + 1)
      }
    } catch {
      setTicketNumber((prev) => prev + 1)
    }

    setStatus("waiting")
  }

  const handleStatusChange = (newStatus: "waiting" | "preparing" | "ready" | "done") => {
    setStatus(newStatus)
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-[2.5rem] border border-white/10 bg-slate-900/80 p-6 md:p-10 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Sandbox
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Coba Langsung Simulasi Antrean</h2>
          <p className="text-sm text-slate-400 mt-1">Rasakan pengalaman pembeli dan kasir dalam satu layar interaktif.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl bg-slate-950/80 p-1 border border-white/10 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("buyer")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all duration-150 cursor-pointer ${
              activeTab === "buyer" ? "bg-emerald-500 text-white shadow-lg" : "text-slate-400 hover:text-white"
            }`}
          >
            📱 Tampilan Pembeli
          </button>
          <button
            onClick={() => setActiveTab("cashier")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all duration-150 cursor-pointer ${
              activeTab === "cashier" ? "bg-amber-500 text-slate-950 shadow-lg" : "text-slate-400 hover:text-white"
            }`}
          >
            🖥️ Tampilan Kasir
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid md:grid-cols-12 gap-8 items-center pt-8">
        {/* Left Column: Controls */}
        <div className="md:col-span-6 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === "buyer" ? (
              <motion.div
                key="buyer-form"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-5"
              >
                <div className="rounded-2xl bg-white/5 p-5 border border-white/10">
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-2">Langkah 1</span>
                  <h3 className="text-lg font-bold text-white mb-2">Input Nama & Pesanan Pembeli</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Di lokasi UMKM, pembeli cukup scan QR Code tanpa perlu download aplikasi atau buat akun login.
                  </p>
                  
                  <form onSubmit={handleTakeTicket} className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1.5">
                        <User className="w-3.5 h-3.5 text-emerald-400" /> Nama Panggilan
                      </label>
                      <Input
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Contoh: Rian, Maya, Budi"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-amber-400" /> Mau Pesan Apa? (Opsional)
                      </label>
                      <Input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Contoh: 2 Es Kopi Susu, 1 Roti Bakar"
                      />
                    </div>

                    <Button type="submit" variant="emerald" className="w-full font-bold" size="lg">
                      Ambil Tiket Antrean <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </form>
                </div>

                <div className="rounded-2xl bg-slate-950/60 p-4 border border-white/5 text-xs text-slate-400 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                    100%
                  </div>
                  <div>
                    <span className="font-bold text-white block">Satu Klik Antre Instant</span>
                    Tidak ada SMS OTP atau captcha yang menghambat pembeli di meja kasir.
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="cashier-controls"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-5"
              >
                <div className="rounded-2xl bg-white/5 p-5 border border-white/10 space-y-4">
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block">Langkah 2</span>
                  <h3 className="text-lg font-bold text-white">Kontrol Status oleh Kasir</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Ubah status tiket #{String(ticketNumber).padStart(3, "0")} ({customerName}) untuk memberi kabar langsung ke pembeli.
                  </p>

                  <div className="grid grid-cols-1 gap-2.5 pt-2">
                    <button
                      onClick={() => handleStatusChange("waiting")}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-150 text-xs font-bold cursor-pointer ${
                        status === "waiting"
                          ? "bg-slate-800 border-slate-600 text-white"
                          : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-slate-400" /> 1. Menunggu Antrean
                      </span>
                      {status === "waiting" && <span className="h-2 w-2 rounded-full bg-slate-400" />}
                    </button>

                    <button
                      onClick={() => handleStatusChange("preparing")}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-150 text-xs font-bold cursor-pointer ${
                        status === "preparing"
                          ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                          : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <ChefHat className="w-4 h-4 text-amber-400" /> 2. Sedang Disiapkan
                      </span>
                      {status === "preparing" && <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />}
                    </button>

                    <button
                      onClick={() => handleStatusChange("ready")}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-150 text-xs font-bold cursor-pointer ${
                        status === "ready"
                          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                          : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-emerald-400" /> 3. Panggil / Siap Diambil 🔔
                      </span>
                      {status === "ready" && <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />}
                    </button>

                    <button
                      onClick={() => handleStatusChange("done")}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-150 text-xs font-bold cursor-pointer ${
                        status === "done"
                          ? "bg-teal-500/20 border-teal-500/50 text-teal-300"
                          : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-teal-400" /> 4. Selesai
                      </span>
                      {status === "done" && <span className="h-2 w-2 rounded-full bg-teal-400" />}
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl bg-amber-500/10 p-4 border border-amber-500/20 text-xs text-amber-200">
                  🔊 <strong>Efek Suara & Haptic:</strong> Saat memilih &quot;Siap Diambil&quot;, HP pembeli akan berbunyi chime dan bergetar otomatis!
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Live Ticket Preview */}
        <div className="md:col-span-6 flex justify-center py-4">
          <TicketStub
            number={ticketNumber}
            customerName={customerName || "Rian"}
            merchantName="Kopi Pagi"
            note={note}
            status={status}
            onReset={() => handleTakeTicket({ preventDefault: () => {} } as React.FormEvent)}
          />
        </div>
      </div>
    </div>
  )
}
