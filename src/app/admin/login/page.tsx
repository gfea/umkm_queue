"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { store } from "@/lib/store"
import { Logo } from "@/components/Logo"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card } from "@/components/ui/Card"
import { motion } from "framer-motion"
import { Lock, Mail, ArrowRight } from "lucide-react"

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErr("")

    setTimeout(() => {
      if (store.login(email, password)) {
        router.push("/admin")
      } else {
        setErr("Email atau password salah. Gunakan: admin@q-lite.gfea.my.id / admin123")
        setLoading(false)
      }
    }, 400)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#090b10] p-4 bg-mesh-gradient relative overflow-hidden">
      {/* Background glowing orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 border-white/10 shadow-2xl backdrop-blur-2xl bg-slate-900/80 space-y-6">
          <div className="text-center space-y-3 flex flex-col items-center">
            <Logo size="xl" subtext="q-lite.gfea.my.id" />
            <h1 className="text-2xl font-black text-white pt-2">Masuk Admin Q-Lite</h1>
            <p className="text-xs text-slate-400">Kelola antrean toko dan cetak QR Code UMKM.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" /> Email Admin
              </label>
              <Input
                type="email"
                placeholder="admin@q-lite.gfea.my.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {err && (
              <p className="text-xs font-bold text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                {err}
              </p>
            )}

            <Button type="submit" variant="emerald" className="w-full" size="lg" isLoading={loading}>
              Masuk Dashboard <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="rounded-2xl bg-white/5 p-4 border border-white/10 text-center space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Kredensial Demo:</span>
            <div className="font-mono text-xs font-bold text-emerald-300">
              admin@q-lite.gfea.my.id <span className="text-slate-500">/</span> admin123
            </div>
          </div>
        </Card>
      </motion.div>
    </main>
  )
}
