import { NextResponse } from "next/server"
import { assertRateLimit, clientKey, clearRateLimit, issueSession, sessionCookie } from "@/lib/security"

export async function POST(req: Request) {
  const key = clientKey(req, "admin_login")
  try {
    assertRateLimit(key, 5, 15 * 60_000)

    const { email, password } = await req.json()
    const cleanEmail = email?.trim().toLowerCase()

    if ((cleanEmail !== "admin@q-lite.gfea.my.id" && cleanEmail !== "admin@qlite.id") || password !== "admin123") {
      return NextResponse.json({ success: false, error: "Kredensial tidak valid" }, { status: 401 })
    }

    clearRateLimit(key)

    const token = await issueSession("admin", cleanEmail)
    const response = NextResponse.json({ success: true })
    response.cookies.set("qlite_admin_token", token, sessionCookie)

    return response
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Gagal login" }, { status: 400 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete("qlite_admin_token")
  return response
}
