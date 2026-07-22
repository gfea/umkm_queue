import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { broadcastTicketUpdate } from "@/lib/sse"

export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const merchantId = searchParams.get("merchantId") || undefined
    const slug = searchParams.get("slug") || undefined

    let targetMerchantId = merchantId
    if (slug && !targetMerchantId) {
      const merchant = db.getMerchantBySlug(slug)
      if (merchant) {
        targetMerchantId = merchant.id
      }
    }

    const tickets = db.getTickets(targetMerchantId)
    return NextResponse.json({ success: true, tickets })
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Gagal mengambil antrean" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { merchantId, slug, customerName, note } = body

    let targetMerchantId = merchantId
    if (slug && !targetMerchantId) {
      const merchant = db.getMerchantBySlug(slug)
      if (!merchant) {
        return NextResponse.json({ success: false, error: "Toko tidak ditemukan" }, { status: 404 })
      }
      targetMerchantId = merchant.id
    }

    if (!targetMerchantId || !customerName) {
      return NextResponse.json({ success: false, error: "Nama pembeli dan toko wajib diisi" }, { status: 400 })
    }

    const ticket = db.joinQueue(targetMerchantId, customerName, note)

    broadcastTicketUpdate(targetMerchantId)

    return NextResponse.json({ success: true, ticket })
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Gagal mengambil nomor antrean" }, { status: 400 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { merchantId, ticketId, status } = body

    if (!merchantId || !ticketId || !status) {
      return NextResponse.json({ success: false, error: "Parameter tidak lengkap" }, { status: 400 })
    }

    const tickets = db.updateTicketStatus(merchantId, ticketId, status)

    broadcastTicketUpdate(merchantId)

    return NextResponse.json({ success: true, tickets })
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Gagal memperbarui status antrean" }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const merchantId = searchParams.get("merchantId")
    if (!merchantId) {
      return NextResponse.json({ success: false, error: "Merchant ID wajib diisi" }, { status: 400 })
    }
    db.resetMerchantQueue(merchantId)

    broadcastTicketUpdate(merchantId)

    return NextResponse.json({ success: true, tickets: [] })
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Gagal mereset antrean" }, { status: 400 })
  }
}
