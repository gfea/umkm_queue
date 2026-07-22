"use client"

export type MerchantStatus = "active" | "suspended"
export type Merchant = { id: string; businessName: string; ownerName: string; email: string; slug: string; accessCode: string; status: MerchantStatus; createdAt: string }
export type QueueTicket = { id: string; merchantId: string; customerName: string; note?: string; number: number; status: "waiting" | "preparing" | "serving" | "done"; createdAt: string }

const MERCHANTS = "qlite_merchants"
const TICKETS = "qlite_tickets"
const SESSION = "qlite_admin"
const MERCHANT_SESSION = "qlite_merchant"
const MERCHANT_SLUG_SESSION = "qlite_merchant_slug"

const seed: Merchant[] = [
  { id: "demo-merchant", businessName: "Kopi Pagi", ownerName: "Budi Santoso", email: "admin@kopipagi.id", slug: "kopi-pagi", accessCode: "kopi123", status: "active", createdAt: new Date().toISOString() },
]

function uuid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID()
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

function createAccessCode() {
  const bytes = new Uint32Array(1)
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes)
    return bytes[0].toString(36).slice(0, 8).padEnd(6, "0")
  }
  return Math.random().toString(36).slice(2, 8).padEnd(6, "0")
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  const value = localStorage.getItem(key)
  return value ? JSON.parse(value) as T : fallback
}

// Silent write: updates localStorage WITHOUT dispatching events (used by fetch sync to avoid cascade loops)
function writeSilent<T>(key: string, value: T) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

// Loud write: updates localStorage AND dispatches events (used for local user actions only)
function write<T>(key: string, value: T) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value))
    window.dispatchEvent(new Event("qlite_update_" + key))
    window.dispatchEvent(new CustomEvent("qlite_storage_change", { detail: { key, value } }))
  }
}

export const store = {
  merchants() {
    const stored = read<Array<Omit<Merchant, "accessCode"> & { accessCode?: string }>>(MERCHANTS, seed)
    const items: Merchant[] = stored.map((item) => {
      let code = item.accessCode
      if (!code) {
        code = item.id === "demo-merchant" ? "kopi123" : createAccessCode()
      }
      return { ...item, accessCode: code } as Merchant
    })
    if (typeof window !== "undefined" && !localStorage.getItem(MERCHANTS)) {
      writeSilent(MERCHANTS, items)
    }
    return items
  },

  async fetchMerchantsAsync(): Promise<Merchant[]> {
    try {
      const res = await fetch("/api/merchants")
      const data = await res.json()
      if (data.success && Array.isArray(data.merchants)) {
        writeSilent(MERCHANTS, data.merchants)
        return data.merchants
      }
    } catch {
      // Fallback to local
    }
    return this.merchants()
  },

  tickets() { return read<QueueTicket[]>(TICKETS, []) },

  // Fetch tickets from API (silent write - no events dispatched to prevent cascade)
  async fetchTicketsAsync(merchantId?: string): Promise<QueueTicket[]> {
    try {
      const url = merchantId ? `/api/tickets?merchantId=${merchantId}` : "/api/tickets"
      const res = await fetch(url)
      const data = await res.json()
      if (data.success && Array.isArray(data.tickets)) {
        writeSilent(TICKETS, data.tickets)
        return data.tickets
      }
    } catch {
      // Fallback to local
    }
    return this.tickets()
  },

  signedIn() { return typeof window !== "undefined" && sessionStorage.getItem(SESSION) === "true" },

  login(email: string, password: string) {
    const formatted = email.trim().toLowerCase()
    const valid = (formatted === "admin@q-lite.gfea.my.id" || formatted === "admin@qlite.id") && password === "admin123"
    if (valid) sessionStorage.setItem(SESSION, "true")
    return valid
  },

  logout() { sessionStorage.removeItem(SESSION) },

  merchant() {
    if (typeof window === "undefined") return null
    const merchantId = sessionStorage.getItem(MERCHANT_SESSION)
    const merchantSlug = sessionStorage.getItem(MERCHANT_SLUG_SESSION)
    const merchants = this.merchants()
    const merchant = merchants.find((item) => item.id === merchantId && item.status === "active")
      ?? merchants.find((item) => item.slug === merchantSlug && item.status === "active")
      ?? null
    if (merchant) {
      sessionStorage.setItem(MERCHANT_SESSION, merchant.id)
      sessionStorage.setItem(MERCHANT_SLUG_SESSION, merchant.slug)
    }
    return merchant
  },

  merchantLogin(email: string, accessCode: string) {
    const cleanEmail = email.trim().toLowerCase()
    const cleanCode = accessCode.trim()
    const all = this.merchants()
    const merchant = all.find(
      (item) =>
        item.status === "active" &&
        item.email.trim().toLowerCase() === cleanEmail &&
        (item.accessCode === cleanCode || (item.id === "demo-merchant" && cleanCode === "kopi123"))
    ) ?? null

    if (merchant && typeof window !== "undefined") {
      sessionStorage.setItem(MERCHANT_SESSION, merchant.id)
      sessionStorage.setItem(MERCHANT_SLUG_SESSION, merchant.slug)
    }
    return merchant
  },

  merchantLogout() { sessionStorage.removeItem(MERCHANT_SESSION); sessionStorage.removeItem(MERCHANT_SLUG_SESSION) },

  toggleMerchant(id: string) {
    const items = this.merchants().map((item) => item.id === id ? { ...item, status: item.status === "active" ? "suspended" : "active" } as Merchant : item)
    write(MERCHANTS, items)
    fetch("/api/merchants", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }).catch(() => {})
    return items
  },

  addMerchant(input: Omit<Merchant, "id" | "createdAt" | "status" | "accessCode"> & { accessCode?: string }) {
    const merchants = this.merchants()
    if (merchants.some((item) => item.email.toLowerCase() === input.email.trim().toLowerCase())) throw new Error("Email toko sudah terdaftar")
    if (merchants.some((item) => item.slug === input.slug)) throw new Error("Nama toko ini sudah dipakai")
    const accessCode = input.accessCode && input.accessCode.trim() ? input.accessCode.trim() : createAccessCode()
    const item: Merchant = { ...input, accessCode, id: uuid(), status: "active", createdAt: new Date().toISOString() }
    const items = [...merchants, item]
    write(MERCHANTS, items)
    fetch("/api/merchants", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) }).catch(() => {})
    return item
  },

  async addMerchantAsync(input: Omit<Merchant, "id" | "createdAt" | "status" | "accessCode"> & { accessCode?: string }): Promise<Merchant> {
    try {
      const res = await fetch("/api/merchants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
      const data = await res.json()
      if (!res.ok || !data.success || !data.merchant) throw new Error(data.error || "Gagal menambah toko")
      const merchant = data.merchant as Merchant
      const merchants = this.merchants().filter((item) => item.id !== merchant.id && item.slug !== merchant.slug && item.email.toLowerCase() !== merchant.email.toLowerCase())
      write(MERCHANTS, [...merchants, merchant])
      return merchant
    } catch (error) {
      if (error instanceof Error && error.message !== "Failed to fetch") throw error
      return this.addMerchant(input)
    }
  },

  registerMerchant(input: Omit<Merchant, "id" | "createdAt" | "status" | "accessCode"> & { accessCode?: string }) {
    const item = this.addMerchant(input)
    if (typeof window !== "undefined") {
      sessionStorage.setItem(MERCHANT_SESSION, item.id)
      sessionStorage.setItem(MERCHANT_SLUG_SESSION, item.slug)
    }
    return item
  },

  async registerMerchantAsync(input: Omit<Merchant, "id" | "createdAt" | "status" | "accessCode"> & { accessCode?: string }): Promise<Merchant> {
    const item = await this.addMerchantAsync(input)
    if (typeof window !== "undefined") {
      sessionStorage.setItem(MERCHANT_SESSION, item.id)
      sessionStorage.setItem(MERCHANT_SLUG_SESSION, item.slug)
    }
    return item
  },

  updateTicketStatus(merchantId: string, ticketId: string, status: QueueTicket["status"]) {
    const current = this.tickets()
    const ticket = current.find((item) => item.id === ticketId && item.merchantId === merchantId)
    if (!ticket) throw new Error("Antrean tidak ditemukan")
    const updated = current.map((item) => item.id === ticketId ? { ...item, status } : item)
    writeSilent(TICKETS, updated)
    fetch("/api/tickets", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ merchantId, ticketId, status }) }).catch(() => {})
    return updated
  },

  async updateTicketStatusAsync(merchantId: string, ticketId: string, status: QueueTicket["status"]): Promise<QueueTicket[]> {
    const current = this.tickets()
    const updated = current.map((item) => item.id === ticketId ? { ...item, status } : item)
    writeSilent(TICKETS, updated)

    try {
      const res = await fetch("/api/tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchantId, ticketId, status }),
      })
      const data = await res.json()
      if (data.success && Array.isArray(data.tickets)) {
        writeSilent(TICKETS, data.tickets)
        return data.tickets
      }
    } catch {
      // Fallback
    }
    return updated
  },

  resetQueue(merchantId: string) {
    const updated = this.tickets().filter((item) => item.merchantId !== merchantId)
    writeSilent(TICKETS, updated)
    fetch(`/api/tickets?merchantId=${merchantId}`, { method: "DELETE" }).catch(() => {})
    return updated
  },

  join(merchantId: string, customerName: string, note?: string) {
    const merchant = this.merchants().find((item) => item.id === merchantId)
    if (!merchant || merchant.status === "suspended") throw new Error("Antrean UMKM sedang tidak tersedia")
    const current = this.tickets()

    // Strict sequential queue numbering calculation for merchant (#001, #002, #003...)
    const merchantTickets = current.filter((item) => item.merchantId === merchantId)
    const lastNumber = merchantTickets.length > 0 ? Math.max(...merchantTickets.map((t) => t.number)) : 0
    const number = lastNumber + 1

    const ticket: QueueTicket = {
      id: uuid(),
      merchantId,
      customerName: customerName.trim(),
      note: note ? note.trim() : undefined,
      number,
      status: "waiting",
      createdAt: new Date().toISOString(),
    }
    writeSilent(TICKETS, [...current, ticket])

    // Fire API call asynchronously to persist to SQLite backend DB
    fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ merchantId, customerName, note }),
    }).catch(() => {})

    return ticket
  },

  async joinAsync(merchantId: string, customerName: string, note?: string): Promise<QueueTicket> {
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchantId, customerName, note }),
      })
      const data = await res.json()
      if (data.success && data.ticket) {
        const current = this.tickets().filter((t) => t.id !== data.ticket.id)
        writeSilent(TICKETS, [...current, data.ticket])
        return data.ticket
      }
    } catch {
      // Fallback
    }
    return this.join(merchantId, customerName, note)
  },
}
