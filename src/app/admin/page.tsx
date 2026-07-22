"use client"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { buildQueueUrl, normalizeSlug } from "@/lib/domain.mjs"
import { Merchant, QueueTicket, store } from "@/lib/store"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"

export default function AdminPage() {
  const router = useRouter()
  const [merchants, setMerchants] = useState<Merchant[]>(() => store.merchants())
  const [tickets] = useState<QueueTicket[]>(() => store.tickets())
  const [businessName, setBusinessName] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [email, setEmail] = useState("")
  const [err, setErr] = useState("")

  useEffect(() => {
    if (!store.signedIn()) { router.replace("/admin/login"); return }
  }, [router])

  const origin = typeof window === "undefined" ? "" : window.location.origin
  const pending = useMemo(() => tickets.filter(t => t.status !== "done"), [tickets])

  function addMerchant(e: React.FormEvent) {
    e.preventDefault(); setErr("")
    try {
      const item = store.addMerchant({ businessName, ownerName, email, slug: normalizeSlug(businessName) })
      setMerchants([...merchants, item]); setBusinessName(""); setOwnerName(""); setEmail("")
    } catch (error) { setErr(error instanceof Error ? error.message : "Gagal tambah UMKM") }
  }

  function toggle(id: string) { setMerchants(store.toggleMerchant(id)) }

  return (
    <main className="min-h-screen bg-[#f7f7f5] p-5 text-slate-950">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3 py-4">
          <div><p className="text-xs font-bold uppercase tracking-[.22em] text-emerald-700">Admin</p><h1 className="text-3xl font-black tracking-[-.04em]">Kelola UMKM</h1></div>
          <Button variant="secondary" onClick={() => { store.logout(); router.push("/admin/login") }}>Keluar</Button>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Card><CardContent className="pt-5"><p className="text-xs text-slate-400">UMKM terdaftar</p><b className="text-3xl">{merchants.length}</b></CardContent></Card>
          <Card><CardContent className="pt-5"><p className="text-xs text-slate-400">Aktif</p><b className="text-3xl">{merchants.filter(m => m.status === "active").length}</b></CardContent></Card>
          <Card><CardContent className="pt-5"><p className="text-xs text-slate-400">Antrean berjalan</p><b className="text-3xl">{pending.length}</b></CardContent></Card>
        </section>

        <Card>
          <CardHeader><h2 className="font-bold">Daftarkan UMKM</h2></CardHeader>
          <CardContent>
            <form onSubmit={addMerchant} className="grid gap-3 md:grid-cols-4">
              <Input placeholder="Nama toko" value={businessName} onChange={e => setBusinessName(e.target.value)} required />
              <Input placeholder="Nama pemilik" value={ownerName} onChange={e => setOwnerName(e.target.value)} required />
              <Input type="email" placeholder="Email pemilik" value={email} onChange={e => setEmail(e.target.value)} required />
              <Button type="submit">Tambah</Button>
            </form>
            {err && <p className="mt-3 text-xs font-semibold text-red-500">{err}</p>}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {merchants.map((m) => {
            const url = buildQueueUrl(origin, m.slug)
            const qr = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}`
            return <Card key={m.id} className={m.status === "suspended" ? "border-red-200 bg-red-50/50" : ""}>
              <CardContent className="grid gap-4 pt-5 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2"><h3 className="text-xl font-black">{m.businessName}</h3><span className="rounded-full bg-white px-2 py-1 text-[11px] font-bold uppercase text-slate-500">{m.status}</span></div>
                  <p className="mt-1 text-sm text-slate-500">{m.ownerName} · {m.email}</p>
                  <a href={url} className="mt-3 block break-all text-sm font-semibold text-emerald-700">{url}</a>
                </div>
                <div className="flex flex-wrap items-center gap-3 md:justify-end">
                  {/* QR is generated on demand by external endpoint; Next Image proxy adds no value here. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qr} alt={`QR antrean ${m.businessName}`} className="h-24 w-24 rounded-xl border bg-white p-1" />
                  <Button variant={m.status === "active" ? "danger" : "secondary"} onClick={() => toggle(m.id)}>{m.status === "active" ? "Suspend" : "Aktifkan"}</Button>
                </div>
              </CardContent>
            </Card>
          })}
        </div>
      </div>
    </main>
  )
}
