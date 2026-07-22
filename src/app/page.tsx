import Link from "next/link"
import { ArrowRight, Clock3, QrCode, Store } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] text-slate-950">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <span className="text-lg font-black tracking-tight">Q-Lite</span>
        <Link href="/admin/login" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50">Masuk admin</Link>
      </nav>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-16 md:grid-cols-2 md:pt-28">
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[.25em] text-emerald-700">Antrean digital UMKM</p>
          <h1 className="max-w-xl text-5xl font-black leading-[.98] tracking-[-.05em] md:text-7xl">Antrean rapi. Pelanggan tetap santai.</h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-slate-600">Buat antrean toko dalam hitungan menit. Pelanggan cukup pindai QR, ambil nomor, lalu pantau giliran.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/admin/login" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-slate-950 px-6 font-bold text-white hover:bg-slate-800">Kelola UMKM <ArrowRight size={17}/></Link>
            <Link href="/q/kopi-pagi" className="inline-flex min-h-12 items-center rounded-xl border border-slate-300 bg-white px-6 font-bold hover:bg-slate-50">Lihat demo</Link>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[ [QrCode,"QR siap pindai","Satu tautan unik untuk tiap UMKM."], [Clock3,"Nomor otomatis","Pelanggan masuk tanpa instal aplikasi."], [Store,"Multi-UMKM","Admin kelola seluruh toko dari satu panel."] ].map(([Icon,title,text], i) => {
            const IconComponent = Icon as typeof QrCode
            return <article key={String(title)} className={`rounded-3xl border border-slate-200 bg-white p-7 shadow-sm ${i === 2 ? "sm:col-span-2" : ""}`}><IconComponent size={25}/><h2 className="mt-8 text-lg font-bold">{String(title)}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{String(text)}</p></article>
          })}
        </div>
      </section>
    </main>
  )
}
