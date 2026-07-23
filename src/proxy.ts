import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ADMIN_SECRET = process.env.ADMIN_SECRET || "qlite-super-admin-secret-key-2026"

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protected paths
  if (pathname.startsWith("/admin")) {
    // Exclude login page and auth API
    if (pathname === "/admin/login" || pathname.startsWith("/api/admin/auth")) {
      return NextResponse.next()
    }

    const token = req.cookies.get("qlite_admin_token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }

    // Verify token structure: hash:email:expiry
    try {
      const parts = token.split(":")
      if (parts.length !== 3) throw new Error("Invalid token")
      
      const [hash, email, expiryStr] = parts
      const expiry = parseInt(expiryStr, 10)
      
      if (Date.now() > expiry) {
        throw new Error("Expired session")
      }

      // Re-verify HMAC-SHA256 signature
      const encoder = new TextEncoder()
      const keyData = encoder.encode(ADMIN_SECRET)
      const dataToSign = encoder.encode(`${email}:${expiryStr}`)
      
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["verify"]
      )
      
      // Convert hex hash back to array buffer
      const hashBytes = new Uint8Array(hash.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))
      
      const isValid = await crypto.subtle.verify(
        "HMAC",
        cryptoKey,
        hashBytes,
        dataToSign
      )

      if (!isValid) {
        throw new Error("Signature mismatch")
      }

      return NextResponse.next()
    } catch {
      // Clear invalid cookie and redirect
      const response = NextResponse.redirect(new URL("/admin/login", req.url))
      response.cookies.delete("qlite_admin_token")
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
