export type SessionPayload = { role: string; sub: string; exp?: number }

export async function createSession(payload: SessionPayload, secret: string, maxAgeMs = 86400_000): Promise<string> {
  const expiry = Date.now() + maxAgeMs
  const encoder = new TextEncoder()
  const dataString = JSON.stringify({ ...payload, exp: expiry })
  const data = encoder.encode(dataString)
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
  const signature = await crypto.subtle.sign("HMAC", key, data)
  const hashHex = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, "0")).join("")
  // Base64 encode JSON untuk menghindari masalah karakter khusus cookie
  const payloadB64 = btoa(encodeURIComponent(dataString))
  return `${hashHex}.${payloadB64}`
}

export async function verifySession(token: string | null | undefined, secret: string, expectedRole?: string): Promise<SessionPayload | null> {
  if (!token) return null
  const parts = token.split(".")
  if (parts.length !== 2) return null
  try {
    const [hashHex, payloadB64] = parts
    const dataString = decodeURIComponent(atob(payloadB64))
    const payload = JSON.parse(dataString)
    
    if (Date.now() > payload.exp) return null
    if (expectedRole && payload.role !== expectedRole) return null
    
    const encoder = new TextEncoder()
    const dataToSign = encoder.encode(dataString)
    const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"])
    const hashBytes = new Uint8Array(
      (hashHex.match(/.{1,2}/g) || []).map((byte) => parseInt(byte, 16))
    )
    const isValid = await crypto.subtle.verify("HMAC", key, hashBytes, dataToSign)
    
    return isValid ? payload : null
  } catch {
    return null
  }
}
