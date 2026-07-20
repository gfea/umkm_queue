"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardHeader, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { createQueueTicket } from "@/services/queueService"
import { QueueItem } from "@/types"

export default function Home() {
  const [name, setName] = useState("")
  const [ticket, setTicket] = useState<QueueItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      // merchantId mockup untuk demo MVP
      const res = await createQueueTicket({ merchantId: "demo-merchant", customerName: name })
      setTicket(res)
    } catch (err: any) {
      setError(err.message || "Gagal mengambil antrean")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Q-Lite</h1>
          <p className="text-sm text-slate-500">Antrean cepat & mudah untuk UMKM</p>
        </div>

        {!ticket ? (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-800">Masuk Antrean</h2>
              <p className="text-xs text-slate-400">Silakan masukkan nama panggilan Anda</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoin} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Contoh: Budi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
                {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
                <Button type="submit" className="w-full" isLoading={loading}>
                  Ambil Nomor
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="relative overflow-hidden">
            <div className="absolute top-1/2 left-0 right-0 h-[1px] border-t border-dashed border-slate-200 -translate-y-1/2" />
            <CardContent className="pt-6 pb-6 text-center space-y-8">
              <div className="pb-6">
                <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Antrean Anda</span>
                <div className="text-7xl font-bold font-mono tracking-tighter text-slate-900 mt-2">
                  {ticket.ticketNumber}
                </div>
                <p className="text-sm font-medium text-slate-500 mt-2">Atas Nama: {ticket.customerName}</p>
              </div>

              <div className="pt-6 flex flex-col items-center gap-3">
                <Badge variant={ticket.status}>{ticket.status === "waiting" ? "Menunggu" : "Diproses"}</Badge>
                <p className="text-xs text-slate-400">Silakan pantau status di layar ini secara berkala</p>
                <Button variant="secondary" className="w-full mt-4" onClick={() => setTicket(null)}>
                  Keluar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
