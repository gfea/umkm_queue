import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { publicMerchant } from "@/lib/publicMerchant"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  try {
    const merchants = db.getMerchants().map(publicMerchant)
    return NextResponse.json({ success: true, merchants })
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Gagal mengambil data toko" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { businessName, ownerName, email, slug, accessCode } = body
    if (!businessName || !ownerName || !email || !slug) {
      return NextResponse.json({ success: false, error: "Semua kolom wajib diisi" }, { status: 400 })
    }
    const merchant = db.addMerchant({ businessName, ownerName, email, slug, accessCode })
    return NextResponse.json({ success: true, merchant: publicMerchant(merchant) })
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Gagal menambah toko" }, { status: 400 })
  }
}

// Hanya Admin (diverifikasi oleh middleware) yang bisa PATCH status merchant.
export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id } = body
    if (!id) {
      return NextResponse.json({ success: false, error: "ID merchant wajib diisi" }, { status: 400 })
    }
    const merchants = db.toggleMerchantStatus(id).map(publicMerchant)
    return NextResponse.json({ success: true, merchants })
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Gagal memperbarui status toko" }, { status: 400 })
  }
}
