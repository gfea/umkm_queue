"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/Logo"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { LogOut, Users, CheckCircle, ShieldCheck, PowerOff, Store } from "lucide-react"

type Stats = {
  totalMerchants: number
  activeMerchants: number
  suspendedMerchants: number
  totalTickets: number
  waitingTickets: number
  servedTickets: number
}

type PublicMerchant = {
  id: string
  businessName: string
  slug: string
  status: string
  createdAt: string
}

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [merchants, setMerchants] = useState<PublicMerchant[]>([])
  
  const [businessName, setBusinessName] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [email, setEmail] = useState("")
  const [accessCode, setAccessCode] = useState("")
  const [slug, setSlug] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    const doLoad = async () => {
      try {
        const res = await fetch("/api/admin/stats")
        if (res.status === 401) {
          router.push("/admin/login")
          return
        }
        const data = await res.json()
        if (data.success && mounted) {
          setStats(data.stats)
          setMerchants(data.merchants)
        }
      } catch {}
    }

    doLoad()
    const intv = setInterval(doLoad, 3000)
    return () => {
      mounted = false
      clearInterval(intv)
    }
  }, [router])

  const refreshData = async () => {
    try {
      const res = await fetch("/api/admin/stats")
      const data = await res.json()
      if (data.success) {
        setStats(data.stats)
        setMerchants(data.merchants)
      }
    } catch {}
  }

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" })
    router.push("/admin/login")
  }

  const handleAddMerchant = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr("")
    setLoading(true)
    try {
      const res = await fetch("/api/merchants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, ownerName, email, slug, accessCode })
      })
      if (res.ok) {
        setBusinessName("")
        setOwnerName("")
        setEmail("")
        setSlug("")
        setAccessCode("")
        refreshData()
      } else {
        const data = await res.json()
        setErr(data.error || "Gagal menambah UMKM")
      }
    } catch {
      setErr("Terjadi kesalahan jaringan")
    }
    setLoading(false)
  }

  const toggleStatus = async (id: string) => {
    try {
      await fetch("/api/merchants", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      })
      refreshData()
    } catch {}
  }

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 p-4 md:p-8 bg-mesh-gradient">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Logo size="lg" showText={false} />
            <div>
              <h1 className="text-xl font-black text-white flex items-center gap-2">
                SUPER ADMIN <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </h1>
              <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">Pusat Kendali Q-Lite</p>
            </div>
          </div>
          <Button variant="danger" size="sm" onClick={handleLogout}>
            <LogOut className="w-3.5 h-3.5 mr-1" /> Keluar
          </Button>
        </header>

        {stats && (
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 border-emerald-500/20 bg-emerald-500/5">
              <span className="text-xs text-emerald-400 font-bold uppercase">UMKM Aktif</span>
              <div className="mt-2 text-3xl font-black font-mono text-white flex items-center gap-2">
                <Store className="w-6 h-6 text-emerald-500" /> {stats.activeMerchants}
              </div>
            </Card>
            <Card className="p-5 border-rose-500/20 bg-rose-500/5">
              <span className="text-xs text-rose-400 font-bold uppercase">UMKM Suspend</span>
              <div className="mt-2 text-3xl font-black font-mono text-white flex items-center gap-2">
                <PowerOff className="w-6 h-6 text-rose-500" /> {stats.suspendedMerchants}
              </div>
            </Card>
            <Card className="p-5 border-amber-500/20 bg-amber-500/5">
              <span className="text-xs text-amber-400 font-bold uppercase">Antrean Menunggu</span>
              <div className="mt-2 text-3xl font-black font-mono text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-amber-500" /> {stats.waitingTickets}
              </div>
            </Card>
            <Card className="p-5 border-blue-500/20 bg-blue-500/5">
              <span className="text-xs text-blue-400 font-bold uppercase">Antrean Selesai</span>
              <div className="mt-2 text-3xl font-black font-mono text-white flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-blue-500" /> {stats.servedTickets}
              </div>
            </Card>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <Card className="p-6 border-white/10 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-400" /> Tambah Merchant Manual
              </h2>
              <form onSubmit={handleAddMerchant} className="space-y-3">
                <Input placeholder="Nama UMKM / Toko" value={businessName} onChange={e => setBusinessName(e.target.value)} required />
                <Input placeholder="Nama Pemilik" value={ownerName} onChange={e => setOwnerName(e.target.value)} required />
                <Input type="email" placeholder="Email UMKM" value={email} onChange={e => setEmail(e.target.value)} required />
                <Input placeholder="Slug URL (misal: warung-tegal)" value={slug} onChange={e => setSlug(e.target.value)} required />
                <Input type="password" placeholder="Kode Akses / Password" value={accessCode} onChange={e => setAccessCode(e.target.value)} required minLength={6} />
                
                {err && <p className="text-xs font-bold text-rose-400">{err}</p>}
                
                <Button type="submit" variant="emerald" className="w-full" isLoading={loading}>
                  Daftarkan Merchant
                </Button>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card className="p-0 border-white/10 overflow-hidden">
              <div className="p-4 border-b border-white/10 bg-white/5">
                <h2 className="text-sm font-bold text-white uppercase tracking-widest">Daftar Merchant Terdaftar</h2>
              </div>
              <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
                {merchants.length === 0 ? (
                  <p className="p-8 text-center text-sm text-slate-500">Belum ada merchant.</p>
                ) : (
                  merchants.map(m => (
                    <div key={m.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-base">{m.businessName}</h3>
                          <Badge variant={m.status === "active" ? "active" : "suspended"}>{m.status}</Badge>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 font-mono">
                          ID: {m.id} | Slug: /q/{m.slug}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant={m.status === "active" ? "danger" : "secondary"} 
                          size="sm" 
                          onClick={() => toggleStatus(m.id)}
                        >
                          <PowerOff className="w-4 h-4 mr-1" />
                          {m.status === "active" ? "Suspend" : "Aktifkan"}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
