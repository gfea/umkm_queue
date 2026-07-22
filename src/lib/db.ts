import fs from "fs"
import path from "path"

export type MerchantStatus = "active" | "suspended"
export type Merchant = {
  id: string
  businessName: string
  ownerName: string
  email: string
  slug: string
  accessCode: string
  status: MerchantStatus
  createdAt: string
}

export type QueueTicket = {
  id: string
  merchantId: string
  customerName: string
  note?: string
  number: number
  status: "waiting" | "preparing" | "serving" | "done"
  createdAt: string
}

type DatabaseSchema = {
  merchants: Merchant[]
  tickets: QueueTicket[]
}

// Store DB file in node_modules/.cache to avoid triggering Next.js Fast Refresh file watcher
const CACHE_DIR = path.join(process.cwd(), "node_modules", ".cache", "qlite")
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true })
}
const DB_FILE = path.join(CACHE_DIR, "sqlite_db.json")

const seedMerchants: Merchant[] = [
  {
    id: "demo-merchant",
    businessName: "Kopi Pagi",
    ownerName: "Budi Santoso",
    email: "admin@kopipagi.id",
    slug: "kopi-pagi",
    accessCode: "kopi123",
    status: "active",
    createdAt: new Date().toISOString(),
  },
]

const seedTickets: QueueTicket[] = [
  {
    id: "ticket-1",
    merchantId: "demo-merchant",
    customerName: "Rian Hidayat",
    note: "2 Es Kopi Susu Extra Ice",
    number: 1,
    status: "preparing",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ticket-2",
    merchantId: "demo-merchant",
    customerName: "Siti Nurhaliza",
    note: "1 Kopi Hitam Panas",
    number: 2,
    status: "waiting",
    createdAt: new Date().toISOString(),
  },
]

function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial: DatabaseSchema = { merchants: seedMerchants, tickets: seedTickets }
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8")
      return initial
    }
    const content = fs.readFileSync(DB_FILE, "utf-8")
    const data = JSON.parse(content) as DatabaseSchema
    if (!data.merchants || data.merchants.length === 0) {
      data.merchants = seedMerchants
    }
    if (!data.tickets) {
      data.tickets = seedTickets
    }
    return data
  } catch (err) {
    console.error("Error reading database file:", err)
    return { merchants: seedMerchants, tickets: seedTickets }
  }
}

function writeDb(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8")
  } catch (err) {
    console.error("Error writing database file:", err)
  }
}

function uuid() {
  return Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11)
}

export const db = {
  getMerchants(): Merchant[] {
    return readDb().merchants
  },

  getMerchantBySlug(slug: string): Merchant | null {
    const merchants = this.getMerchants()
    return merchants.find((m) => m.slug === slug) ?? null
  },

  getMerchantById(id: string): Merchant | null {
    const merchants = this.getMerchants()
    return merchants.find((m) => m.id === id) ?? null
  },

  addMerchant(input: { businessName: string; ownerName: string; email: string; slug: string; accessCode?: string }): Merchant {
    const data = readDb()
    if (data.merchants.some((m) => m.email.toLowerCase() === input.email.trim().toLowerCase())) {
      throw new Error("Email toko sudah terdaftar")
    }
    if (data.merchants.some((m) => m.slug === input.slug)) {
      throw new Error("Nama toko ini sudah dipakai")
    }
    const newMerchant: Merchant = {
      id: uuid(),
      businessName: input.businessName.trim(),
      ownerName: input.ownerName.trim(),
      email: input.email.trim().toLowerCase(),
      slug: input.slug,
      accessCode: input.accessCode && input.accessCode.trim() ? input.accessCode.trim() : "123456",
      status: "active",
      createdAt: new Date().toISOString(),
    }
    data.merchants.push(newMerchant)
    writeDb(data)
    return newMerchant
  },

  toggleMerchantStatus(id: string): Merchant[] {
    const data = readDb()
    data.merchants = data.merchants.map((m) =>
      m.id === id ? { ...m, status: m.status === "active" ? "suspended" : "active" } : m
    )
    writeDb(data)
    return data.merchants
  },

  getTickets(merchantId?: string): QueueTicket[] {
    const data = readDb()
    if (!merchantId) return data.tickets
    return data.tickets
      .filter((t) => t.merchantId === merchantId)
      .sort((a, b) => a.number - b.number)
  },

  joinQueue(merchantId: string, customerName: string, note?: string): QueueTicket {
    const data = readDb()
    const merchant = data.merchants.find((m) => m.id === merchantId)
    if (!merchant || merchant.status === "suspended") {
      throw new Error("Antrean UMKM sedang tidak tersedia")
    }

    // Strict sequential queue numbering for each merchant (#001, #002, #003...)
    const merchantTickets = data.tickets.filter((t) => t.merchantId === merchantId)
    const lastTicketNumber = merchantTickets.length > 0
      ? Math.max(...merchantTickets.map((t) => t.number))
      : 0
    const nextNumber = lastTicketNumber + 1

    const newTicket: QueueTicket = {
      id: uuid(),
      merchantId,
      customerName: customerName.trim(),
      note: note && note.trim() ? note.trim() : undefined,
      number: nextNumber,
      status: "waiting",
      createdAt: new Date().toISOString(),
    }

    data.tickets.push(newTicket)
    writeDb(data)
    return newTicket
  },

  updateTicketStatus(merchantId: string, ticketId: string, status: QueueTicket["status"]): QueueTicket[] {
    const data = readDb()
    const ticketIndex = data.tickets.findIndex((t) => t.id === ticketId && t.merchantId === merchantId)
    if (ticketIndex === -1) {
      throw new Error("Antrean tidak ditemukan")
    }
    data.tickets[ticketIndex].status = status
    writeDb(data)
    return data.tickets.filter((t) => t.merchantId === merchantId)
  },

  resetMerchantQueue(merchantId: string): QueueTicket[] {
    const data = readDb()
    data.tickets = data.tickets.filter((t) => t.merchantId !== merchantId)
    writeDb(data)
    return []
  },
}
