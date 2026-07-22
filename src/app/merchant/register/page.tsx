"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, KeyRound, Mail, Store, User, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Logo } from "@/components/Logo"
import { store } from "@/lib/store"
import { normalizeSlug } from "@/lib/domain.mjs"
import { motion } from "framer-motion"

export default function MerchantRegisterPage() {
  const router = useRouter()
  const [businessName, setBusinessName] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [email, setEmail] = useState("")
  const [accessCode, setAccessCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const computedSlug = businessName ? normalizeSlug(businessName) : "nama-toko-anda"

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      const slug = normalizeSlug(businessName)
      await store.registerMerchantAsync({
        businessName,
        ownerName,
        email,
        slug,
        accessCode: accessCode.trim() || undefined,
      })
      router.push("/merchant")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mendaftarkan toko")
      setLoading(false)
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#090b10] bg-mesh-gradient p-5">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        <Card className="relative border-white/10 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-2xl">
          <div className="mb-7 text-center flex flex-col items-center">
            <Logo size="lg" subtext="REGISTRASI UMKM" />
            <h1 className="mt-4 text-2xl font-black text-white">Daftarkan Toko Anda Gratis</h1>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              Buat sistem antrean digital untuk toko Anda dalam hitungan detik.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Store className="h-4 w-4 text-emerald-400" /> Nama Toko / UMKM
              </label>
              <Input
                placeholder="Contoh: Kedai Kopi Pagi"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />
              <div className="text-[11px] font-mono text-emerald-400/80 pt-1">
                Tautan Antrean: <span className="underline">q-lite.gfea.my.id/q/{computedSlug}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <User className="h-4 w-4 text-emerald-400" /> Nama Pemilik
                </label>
                <Input
                  placeholder="Contoh: Budi Santoso"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-emerald-400" /> Email Toko
                </label>
                <Input
                  type="email"
                  placeholder="admin@kopipagi.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-amber-400" /> Kode Akses / Password
              </label>
              <Input
                type="password"
                placeholder="Buat password (min 6 karakter)"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                minLength={6}
                required
              />
              <p className="text-[10px] text-slate-400">Digunakan untuk login kasir kelola antrean toko Anda.</p>
            </div>

            {error && (
              <p role="alert" className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-300">
                {error}
              </p>
            )}

            <Button type="submit" variant="emerald" size="lg" className="w-full font-bold" isLoading={loading}>
              Daftar Toko & Buka Dashboard <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </form>

          {/* Value props */}
          <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Gratis 50 antrean/hari
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Instant QR generator
            </span>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            Sudah punya akun toko?{" "}
            <Link href="/merchant/login" className="font-bold text-emerald-400 hover:underline">
              Masuk di sini
            </Link>
          </div>
        </Card>
      </motion.div>
    </main>
  )
}
