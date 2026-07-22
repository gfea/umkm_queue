"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, KeyRound, Mail, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Logo } from "@/components/Logo"
import { store } from "@/lib/store"

export default function MerchantLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [accessCode, setAccessCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)

    await store.fetchMerchantsAsync()
    const merchant = store.merchantLogin(email, accessCode)
    if (merchant) {
      router.push("/merchant")
      return
    }

    setError("Email atau kode akses salah, atau toko sedang ditangguhkan.")
    setLoading(false)
  }

  function fillDemoCredentials() {
    setEmail("admin@kopipagi.id")
    setAccessCode("kopi123")
    setError("")
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#090b10] bg-mesh-gradient p-5">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-40" />
      <Card className="relative w-full max-w-md border-white/10 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-2xl">
        <div className="mb-7 text-center flex flex-col items-center">
          <Logo size="lg" subtext="PORTAL KASIR / MERCHANT" />
          <h1 className="mt-4 text-2xl font-black text-white">Masuk Pengelola Toko</h1>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-400">Panggil pelanggan, reset antrean harian, dan cetak QR toko.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block space-y-2 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-emerald-400" /> Email toko</span>
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@kopipagi.id" autoComplete="email" required />
          </label>
          <label className="block space-y-2 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-2"><KeyRound className="h-4 w-4 text-amber-400" /> Kode akses</span>
            <Input type="password" value={accessCode} onChange={(event) => setAccessCode(event.target.value)} placeholder="kopi123" autoComplete="current-password" minLength={6} required />
          </label>

          {error && <p role="alert" className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-300">{error}</p>}

          <Button type="submit" variant="emerald" size="lg" className="w-full" isLoading={loading}>
            Masuk Dashboard <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </form>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-center space-y-2">
          <span className="block font-mono text-[10px] uppercase tracking-widest text-slate-500">Akun demo</span>
          <p className="font-mono text-xs font-bold text-emerald-300">admin@kopipagi.id / kopi123</p>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline font-semibold cursor-pointer pt-1"
          >
            <Sparkles className="w-3 h-3" /> Isi Otomatis Akun Demo
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400 border-t border-white/10 pt-4 flex items-center justify-between">
          <Link href="/merchant/register" className="font-bold text-emerald-400 hover:underline">
            + Daftarkan Toko Baru
          </Link>
          <Link href="/" className="hover:text-white">
            Kembali ke Beranda
          </Link>
        </div>
      </Card>
    </main>
  )
}
