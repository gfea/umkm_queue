import { createSession, verifySession, type SessionPayload } from "./session"

const attempts = new Map<string, { count: number; resetAt: number }>()

export function requiredSecret(name: "ADMIN_SECRET" | "MERCHANT_SECRET") {
  const value = process.env[name]
  if (value && value.length >= 32) return value
  if (process.env.NODE_ENV !== "production") return `development-only-${name.toLowerCase()}-change-me`
  throw new Error(`${name} belum dikonfigurasi`)
}

export function assertRateLimit(key: string, limit = 5, windowMs = 15 * 60_000) {
  const now = Date.now()
  const current = attempts.get(key)
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs })
    return
  }
  if (current.count >= limit) throw new Error("Terlalu banyak percobaan. Coba lagi nanti.")
  current.count++
}

export function clearRateLimit(key: string) {
  attempts.delete(key)
}

export function cookieValue(req: Request, name: string) {
  const cookie = req.headers.get("cookie") ?? ""
  const match = cookie.split(";").map(v => v.trim()).find(v => v.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null
}

export async function issueSession(role: "admin" | "merchant", sub: string) {
  const secret = requiredSecret(role === "admin" ? "ADMIN_SECRET" : "MERCHANT_SECRET")
  return createSession({ role, sub }, secret, 8 * 60 * 60_000)
}

export async function readSession(req: Request, role: "admin" | "merchant"): Promise<SessionPayload | null> {
  const name = role === "admin" ? "qlite_admin_token" : "qlite_merchant_token"
  const secret = requiredSecret(role === "admin" ? "ADMIN_SECRET" : "MERCHANT_SECRET")
  return verifySession(cookieValue(req, name), secret, role)
}

export function safeText(value: unknown, max: number) {
  if (typeof value !== "string") return ""
  return value.trim().replace(/[\u0000-\u001f\u007f]/g, "").slice(0, max)
}

export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin")
  if (!origin) return true
  try { return new URL(origin).host === new URL(req.url).host } catch { return false }
}

export function clientKey(req: Request, scope: string) {
  const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown"
  return `${scope}:${ip.trim()}`
}

export const sessionCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: 8 * 60 * 60,
}
