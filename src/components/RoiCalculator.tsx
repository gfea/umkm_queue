"use client"
import React, { useState } from "react"
import { motion } from "framer-motion"
import { Clock, TrendingUp, Users, DollarSign } from "lucide-react"

export function RoiCalculator() {
  const [dailyCustomers, setDailyCustomers] = useState(45)
  const [avgWaitMinutes, setAvgWaitMinutes] = useState(15)

  // Calculations
  const hoursSavedPerMonth = Math.round((dailyCustomers * 4 * 30) / 60)
  const revenueBoostPercent = Math.min(35, Math.round(dailyCustomers * 0.4))
  const estimatedExtraOrders = Math.round(dailyCustomers * 0.18 * 30)

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-[2.5rem] border border-white/10 bg-slate-900/60 p-6 md:p-10 backdrop-blur-xl shadow-2xl overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
        <div>
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-2">ROI Calculator</span>
          <h2 className="text-2xl md:text-3xl font-black text-white">Hitung Efisiensi Toko Anda</h2>
          <p className="text-sm text-slate-400 mt-1">Geser slider untuk melihat estimasi penghematan waktu & kenaikan kapasitas pelanggan.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8 pt-8 items-center">
        {/* Sliders */}
        <div className="md:col-span-6 space-y-6">
          {/* Slider 1 */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-200">Jumlah Pembeli per Hari:</span>
              <span className="font-mono text-lg font-black text-emerald-400">{dailyCustomers} orang</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={dailyCustomers}
              onChange={(e) => setDailyCustomers(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>10 orang</span>
              <span>100 orang</span>
              <span>200 orang</span>
            </div>
          </div>

          {/* Slider 2 */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-200">Rata-rata Waktu Tunggu:</span>
              <span className="font-mono text-lg font-black text-amber-400">{avgWaitMinutes} menit</span>
            </div>
            <input
              type="range"
              min="5"
              max="45"
              step="5"
              value={avgWaitMinutes}
              onChange={(e) => setAvgWaitMinutes(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>5 mnt</span>
              <span>25 mnt</span>
              <span>45 mnt</span>
            </div>
          </div>
        </div>

        {/* Results Cards */}
        <div className="md:col-span-6 grid grid-cols-2 gap-4">
          <motion.div
            key={hoursSavedPerMonth}
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl bg-emerald-500/10 p-5 border border-emerald-500/20 text-emerald-300"
          >
            <Clock className="w-6 h-6 text-emerald-400 mb-2" />
            <div className="text-3xl font-black font-mono tracking-tight">{hoursSavedPerMonth} jam</div>
            <div className="text-xs text-emerald-200/80 font-medium mt-1">Waktu Kasir Dihemat / Bulan</div>
          </motion.div>

          <motion.div
            key={estimatedExtraOrders}
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl bg-amber-500/10 p-5 border border-amber-500/20 text-amber-300"
          >
            <TrendingUp className="w-6 h-6 text-amber-400 mb-2" />
            <div className="text-3xl font-black font-mono tracking-tight">+{estimatedExtraOrders}</div>
            <div className="text-xs text-amber-200/80 font-medium mt-1">Potensi Pesanan Tambahan / Bulan</div>
          </motion.div>

          <div className="col-span-2 rounded-2xl bg-slate-950/80 p-4 border border-white/10 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" /> Pengurangan Kerumunan Kasir
            </span>
            <span className="font-bold text-emerald-400 font-mono">Hingga -70%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
