"use client"

export type MerchantStatus = "active" | "suspended"
export type Merchant = { id: string; businessName: string; ownerName: string; email: string; slug: string; status: MerchantStatus; createdAt: string }
export type QueueTicket = { id: string; merchantId: string; customerName: string; number: number; status: "waiting" | "serving" | "done"; createdAt: string }

const MERCHANTS = "qlite_merchants"
const TICKETS = "qlite_tickets"
const SESSION = "qlite_admin"

const seed: Merchant[] = [
  { id: "demo-merchant", businessName: "Kopi Pagi", ownerName: "Budi Santoso", email: "admin@kopipagi.id", slug: "kopi-pagi", status: "active", createdAt: new Date().toISOString() },
]

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  const value = localStorage.getItem(key)
  return value ? JSON.parse(value) as T : fallback
}
function write<T>(key: string, value: T) { localStorage.setItem(key, JSON.stringify(value)) }

export const store = {
  merchants() { const items = read<Merchant[]>(MERCHANTS, seed); if (typeof window !== "undefined" && !localStorage.getItem(MERCHANTS)) write(MERCHANTS, items); return items },
  tickets() { return read<QueueTicket[]>(TICKETS, []) },
  signedIn() { return typeof window !== "undefined" && sessionStorage.getItem(SESSION) === "true" },
  login(email: string, password: string) {
    const valid = email.trim().toLowerCase() === "admin@qlite.id" && password === "admin123"
    if (valid) sessionStorage.setItem(SESSION, "true")
    return valid
  },
  logout() { sessionStorage.removeItem(SESSION) },
  toggleMerchant(id: string) {
    const items = this.merchants().map((item) => item.id === id ? { ...item, status: item.status === "active" ? "suspended" : "active" } as Merchant : item)
    write(MERCHANTS, items); return items
  },
  addMerchant(input: Omit<Merchant, "id" | "createdAt" | "status">) {
    const item: Merchant = { ...input, id: crypto.randomUUID(), status: "active", createdAt: new Date().toISOString() }
    const items = [...this.merchants(), item]; write(MERCHANTS, items); return item
  },
  join(merchantId: string, customerName: string) {
    const merchant = this.merchants().find((item) => item.id === merchantId)
    if (!merchant || merchant.status === "suspended") throw new Error("Antrean UMKM sedang tidak tersedia")
    const current = this.tickets()
    const number = current.filter((item) => item.merchantId === merchantId).length + 1
    const ticket: QueueTicket = { id: crypto.randomUUID(), merchantId, customerName: customerName.trim(), number, status: "waiting", createdAt: new Date().toISOString() }
    write(TICKETS, [...current, ticket]); return ticket
  },
}
