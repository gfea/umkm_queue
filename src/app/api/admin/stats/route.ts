import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { readSession } from "@/lib/security"
import { publicMerchant } from "@/lib/publicMerchant"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    const session = await readSession(req, "admin")
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const merchants = db.getMerchants()
    const tickets = db.getTickets()

    const activeMerchants = merchants.filter(m => m.status === "active").length
    const suspendedMerchants = merchants.length - activeMerchants
    const totalTickets = tickets.length
    const waitingTickets = tickets.filter(t => t.status === "waiting").length
    const servedTickets = tickets.filter(t => t.status === "done").length

    return NextResponse.json({
      success: true,
      stats: {
        totalMerchants: merchants.length,
        activeMerchants,
        suspendedMerchants,
        totalTickets,
        waitingTickets,
        servedTickets
      },
      merchants: merchants.map(publicMerchant),
      tickets
    })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal memuat statistik" }, { status: 500 })
  }
}
