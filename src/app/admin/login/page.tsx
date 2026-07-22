"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { store } from "@/lib/store"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardHeader, CardContent } from "@/components/ui/Card"

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)

  const handle = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setErr("")
    setTimeout(() => {
      if (store.login(email, password)) { router.push("/admin") }
      else { setErr("Email atau password salah"); setLoading(false) }
    }, 400)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5] p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <h1 className="text-xl font-bold">Masuk Admin</h1>
          <p className="text-xs text-slate-400">Q-Lite Management Panel</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handle} className="space-y-4">
            <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            {err && <p className="text-xs font-semibold text-red-500">{err}</p>}
            <Button type="submit" className="w-full" isLoading={loading}>Masuk</Button>
            <p className="text-center text-[11px] text-slate-400">Demo: admin@qlite.id / admin123</p>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
