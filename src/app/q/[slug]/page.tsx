"use client"
import { useState } from "react"
import { useParams } from "next/navigation"
import { store, Merchant, QueueTicket } from "@/lib/store"
import { Button } from "@/components/ui/Button"

export default function QueuePage() {
  const params = useParams<{ slug: string }>()
  const [merchant] = useState<Merchant | null>(() => store.merchants().find((m) => m.slug === params.slug) ?? null)
  const [name, setName] = useState("")
  const [ticket, setTicket] = useState<QueueTicket | null>(null)
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)

  if (!merchant) return <main className="grid min-h-screen place-items-center bg-[#fbfaf7] px-5 text-sm text-stone-500">Toko tidak ditemukan.</main>

  if (merchant.status === "suspended") return (
    <main className="grid min-h-screen place-items-center bg-[#fbfaf7] px-5 text-center">
      <section className="max-w-sm rounded-[2rem] border border-red-100 bg-white p-8 shadow-[0_24px_80px_rgba(127,29,29,.08)]">
        <p className="text-xs font-black uppercase tracking-[.28em] text-red-500">Ditangguhkan</p>
        <h1 className="mt-4 text-3xl font-black tracking-[-.05em] text-stone-950">{merchant.businessName}</h1>
        <p className="mt-3 text-sm leading-6 text-stone-500">Antrean sedang ditutup sementara oleh admin.</p>
      </section>
    </main>
  )

  const join = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(""); setLoading(true)
    await new Promise((r) => setTimeout(r, 250))
    try { setTicket(store.join(merchant.id, name)) }
    catch (error) { setErr(error instanceof Error ? error.message : "Gagal masuk antrean") }
    finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfaf7] text-stone-950">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,.16),transparent_32%),radial-gradient(circle_at_85%_0%,rgba(245,158,11,.14),transparent_28%)]" />
      <section className="relative mx-auto flex min-h-screen w-full max-w-md flex-col justify-between px-5 py-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[.28em] text-emerald-700">Antrean</p>
            <h1 className="mt-2 text-3xl font-black tracking-[-.06em]">{merchant.businessName}</h1>
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-stone-950 text-sm font-black text-white shadow-lg">Q</div>
        </header>

        {!ticket ? (
          <form onSubmit={join} className="rounded-[2rem] border border-white/80 bg-white/85 p-4 shadow-[0_24px_80px_rgba(28,25,23,.12)] backdrop-blur">
            <div className="rounded-[1.5rem] bg-stone-950 p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-[.22em] text-white/45">Nomor antrean</p>
              <div className="mt-10 font-mono text-8xl font-black tracking-[-.12em] text-white/90">---</div>
              <p className="mt-4 text-sm leading-6 text-white/55">Masukkan nama panggilan. Nomor keluar otomatis.</p>
            </div>
            <div className="space-y-3 px-1 pt-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama panggilan"
                required
                disabled={loading}
                className="h-14 w-full rounded-2xl border border-stone-200 bg-[#fbfaf7] px-4 text-base font-semibold outline-none transition focus:border-stone-950 focus:bg-white focus:ring-4 focus:ring-stone-950/5"
              />
              {err && <p className="rounded-2xl bg-red-50 px-4 py-3 text-xs font-bold text-red-600">{err}</p>}
              <Button type="submit" className="h-14 w-full rounded-2xl text-base" isLoading={loading}>Ambil Nomor</Button>
            </div>
          </form>
        ) : (
          <section className="rounded-[2.25rem] border border-white/80 bg-white/90 p-5 text-center shadow-[0_24px_90px_rgba(28,25,23,.14)] backdrop-blur">
            <div className="rounded-[1.75rem] bg-stone-950 px-4 py-10 text-white">
              <p className="text-xs font-black uppercase tracking-[.28em] text-emerald-300">Nomor Anda</p>
              <div className="mt-4 font-mono text-9xl font-black tracking-[-.13em]">{String(ticket.number).padStart(3, "0")}</div>
              <p className="mt-3 text-sm text-white/55">{ticket.customerName}</p>
            </div>
            <p className="mx-auto mt-5 max-w-xs text-sm leading-6 text-stone-500">Simpan layar ini. Petugas akan memanggil nomor Anda.</p>
            <Button variant="secondary" className="mt-5 h-13 w-full rounded-2xl" onClick={() => setTicket(null)}>Ambil lagi</Button>
          </section>
        )}

        <footer className="text-center text-[11px] font-semibold text-stone-400">Q-Lite · tanpa instal aplikasi</footer>
      </section>
    </main>
  )
}
