"use client"
import { useState } from "react"
import { useParams } from "next/navigation"
import { store, Merchant, QueueTicket } from "@/lib/store"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"

export default function QueuePage() {
  const params = useParams<{ slug: string }>()
  const [merchant] = useState<Merchant | null>(() => store.merchants().find((m) => m.slug === params.slug) ?? null)
  const [name, setName] = useState("")
  const [ticket, setTicket] = useState<QueueTicket | null>(null)
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)


  if (!merchant) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5]">
        <p className="text-sm text-slate-500">Toko tidak ditemukan.</p>
      </main>
    )
  }

  if (merchant.status === "suspended") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f7f5] p-4">
        <div className="text-3xl">⛔</div>
        <h1 className="text-xl font-black">{merchant.businessName}</h1>
        <p className="text-sm text-slate-500">Antrean sedang ditangguhkan oleh admin.</p>
      </main>
    )
  }

  const join = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(""); setLoading(true)
    await new Promise((r) => setTimeout(r, 300))
    try { setTicket(store.join(merchant.id, name)) }
    catch (error) { setErr(error instanceof Error ? error.message : "Gagal masuk antrean") }
    finally { setLoading(false) }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f7f7f5] p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-black">{merchant.businessName}</h1>
          <p className="text-sm text-slate-500">Antrean digital</p>
        </div>

        {!ticket ? (
          <Card>
            <CardHeader><h2 className="font-semibold">Masuk Antrean</h2></CardHeader>
            <CardContent>
              <form onSubmit={join} className="space-y-3">
                <Input placeholder="Nama panggilan" value={name} onChange={e => setName(e.target.value)} disabled={loading} required />
                {err && <p className="text-xs font-semibold text-red-500">{err}</p>}
                <Button type="submit" className="w-full" isLoading={loading}>Ambil Nomor</Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="relative overflow-hidden">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-dashed border-slate-200" />
            <CardContent className="pb-8 pt-8 text-center space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Nomor antrean</span>
                <div className="mt-1 font-mono text-8xl font-black tracking-tighter">
                  {String(ticket.number).padStart(3, "0")}
                </div>
                <p className="mt-2 text-sm text-slate-500">Atas nama: <strong>{ticket.customerName}</strong></p>
              </div>
              <div className="space-y-3">
                <Badge variant={ticket.status}>{ticket.status === "waiting" ? "Menunggu" : ticket.status === "serving" ? "Dilayani" : "Selesai"}</Badge>
                <p className="text-xs text-slate-400">Tunggu giliran Anda, atau minta bantuan staf</p>
                <Button variant="secondary" className="w-full" onClick={() => setTicket(null)}>Keluar</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
