"use client"
import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Navbar } from "@/components/Navbar"
import { ParallaxHero } from "@/components/ParallaxHero"
import { InteractiveQueueDemo } from "@/components/InteractiveQueueDemo"
import { RoiCalculator } from "@/components/RoiCalculator"
import { Logo } from "@/components/Logo"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import {
  QrCode,
  Store,
  Volume2,
  Zap,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  Shield,
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      {/* Sticky Glass Navbar */}
      <Navbar />

      {/* Hero Section with Parallax */}
      <ParallaxHero />

      {/* Section 2: Fitur Utama (Grid with 3D Hover Cards) */}
      <section id="fitur" className="relative py-24 px-5 max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block">Fitur Unggulan</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Dirancang Khusus untuk Kecepatan UMKM
          </h2>
          <p className="text-sm md:text-base text-slate-400">
            Tanpa sistem rumit. Tanpa perlu beli hardware khusus. Cukup gunakan HP atau Tablet yang sudah ada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: QrCode,
              title: "QR Code Unik Instant",
              desc: "Cetak QR Code unik per toko untuk ditempel di meja kasir, gerobak, atau spanduk. Pembeli scan dan langsung masuk antrean.",
            },
            {
              icon: Smartphone,
              title: "Tanpa Instal Aplikasi",
              desc: "Pembeli tidak perlu download APK, tidak perlu isi form registrasi panjang. Cukup tulis nama panggilan dalam 3 detik.",
            },
            {
              icon: Volume2,
              title: "Sound & Haptic Alert",
              desc: "Ketika nomor pembeli dipanggil oleh kasir, HP pembeli akan berdering chime dan bergetar otomatis meskipun sedang disaku.",
            },
            {
              icon: Zap,
              title: "Real-Time WebSocket Sync",
              desc: "Perubahan status antrean di dashboard kasir langsung ter-update di layar HP pembeli secara instant tanpa perlu refresh.",
            },
            {
              icon: Store,
              title: "Multi-Toko & Cabang",
              desc: "Kelola beberapa outlet warung/kedai dalam satu akun admin dengan laporan antrean terpusat.",
            },
            {
              icon: Shield,
              title: "Reset Harian Otomatis",
              desc: "Nomor antrean otomatis kembali ke #001 setiap hari, menjaga histori tetap rapi dan relevan.",
            },
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card hoverEffect className="h-full group p-6 space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Section 3: Interactive Sandbox Demo */}
      <section id="simulasi" className="relative py-20 px-5 bg-dots-pattern">
        <InteractiveQueueDemo />
      </section>

      {/* Section 4: Alur Kerja (3 Steps) */}
      <section className="relative py-24 px-5 max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block">Alur Kerja</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            3 Langkah Mudah Memulai Q-Lite
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {[
            {
              step: "01",
              title: "Penjual Daftar & Cetak QR",
              desc: "Daftarkan nama toko di panel admin Q-Lite dan unduh QR Code unik toko Anda secara gratis.",
            },
            {
              step: "02",
              title: "Pembeli Pindai & Antre",
              desc: "Pelanggan memindai QR di toko, memasukkan nama panggilan, dan mendapatkan nomor tiket digital.",
            },
            {
              step: "03",
              title: "Kasir Panggil & Selesai",
              desc: "Kasir menekan tombol panggil di tablet/HP. Pembeli mendapatkan notifikasi getar dan mengambil pesanan.",
            },
          ].map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative rounded-3xl border border-white/10 bg-slate-900/40 p-8 backdrop-blur-xl space-y-4"
            >
              <div className="font-mono text-5xl font-black text-emerald-500/30">{item.step}</div>
              <h3 className="text-xl font-bold text-white">{item.title}</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 5: ROI Calculator */}
      <section id="kalkulator" className="relative py-20 px-5">
        <RoiCalculator />
      </section>

      {/* Section 6: Pricing / Paket Layanan */}
      <section id="harga" className="relative py-24 px-5 max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block">Harga Transparan</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Pilih Paket yang Sesuai dengan UMKM Anda
          </h2>
          <p className="text-sm text-slate-400">Mulai dari gratis tanpa komitmen credit card.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Starter / Free Tier */}
          <Card className="p-8 flex flex-col justify-between space-y-6 border-white/10">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold font-mono">
                PAKET GRATIS
              </span>
              <div>
                <h3 className="text-3xl font-black text-white">Rp 0</h3>
                <p className="text-xs text-slate-400">Selamanya gratis untuk UMKM rintisan</p>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Hingga 50 tiket antrean / hari
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Standard QR Code generator
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-time status sync
                </li>
                <li className="flex items-center gap-2 text-slate-500">
                  <span>- Custom logo toko (Fitur Pro)</span>
                </li>
              </ul>
            </div>
            <Link href="/admin/login">
              <Button variant="secondary" className="w-full">
                Mulai Gratis Sekarang
              </Button>
            </Link>
          </Card>

          {/* Pro Tier */}
          <Card className="p-8 flex flex-col justify-between space-y-6 border-emerald-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/40 relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)]">
            <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase font-mono px-4 py-1.5 rounded-bl-xl">
              PALING POPULER
            </div>
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono border border-emerald-500/30">
                PAKET PRO UNLIMITED
              </span>
              <div>
                <h3 className="text-3xl font-black text-white flex items-baseline gap-1">
                  Rp 49.000 <span className="text-xs font-normal text-slate-400">/ bulan</span>
                </h3>
                <p className="text-xs text-slate-400">Cocok untuk kedai ramai & foodcourt</p>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Antrean UNLIMITED per hari
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Custom branding & logo toko
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sound & Vibration Alert pembeli
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multi-kasir & analisis harian
                </li>
              </ul>
            </div>
            <Link href="/admin/login">
              <Button variant="emerald" className="w-full" size="lg">
                Coba Pro 14 Hari Gratis <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-5 bg-slate-950">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="md" subtext="q-lite.gfea.my.id" />

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sistem Operasional 100% Normal</span>
          </div>

          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} Q-Lite · Solusi Antrean Digital Ringan UMKM Indonesia.
          </div>
        </div>
      </footer>
    </div>
  )
}
