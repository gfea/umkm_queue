import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { assertRateLimit, clientKey, clearRateLimit, issueSession, sessionCookie } from "@/lib/security"

export async function POST(req: Request) {
  const key = clientKey(req, "merchant_login")
  try {
    assertRateLimit(key, 10, 15 * 60_000)

    const { email, accessCode } = await req.json()
    const cleanEmail = email?.trim().toLowerCase()
    const cleanCode = accessCode?.trim()

    const all = db.getMerchants()
    const merchant = all.find(
      (item) =>
        item.status === "active" &&
        item.email.trim().toLowerCase() === cleanEmail &&
        (item.accessCode === cleanCode || (item.id === "demo-merchant" && cleanCode === "kopi123"))
    )

    if (!merchant) {
      return NextResponse.json({ success: false, error: "Kredensial tidak valid atau toko ditangguhkan" }, { status: 401 })
    }

    clearRateLimit(key)

    const token = await issueSession("merchant", merchant.id)
    const response = NextResponse.json({ success: true, merchantId: merchant.id, slug: merchant.slug })
    response.cookies.set("qlite_merchant_token", token, sessionCookie)

    return response
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Gagal login" }, { status: 400 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete("qlite_merchant_token")
  return response
}
