import test from "node:test"
import assert from "node:assert/strict"
import { createSession, verifySession } from "../src/lib/session.ts"
import { publicMerchant } from "../src/lib/publicMerchant.ts"

test("session valid hanya dengan secret dan role yang benar", async () => {
  const token = await createSession({ role: "admin", sub: "admin@example.test" }, "secret-yang-panjang-dan-acak", 60_000)
  assert.equal((await verifySession(token, "secret-yang-panjang-dan-acak", "admin"))?.sub, "admin@example.test")
  assert.equal(await verifySession(token, "secret-salah", "admin"), null)
  assert.equal(await verifySession(token, "secret-yang-panjang-dan-acak", "merchant"), null)
})

test("data toko publik tidak membocorkan kode akses", () => {
  const merchant = publicMerchant({ id: "1", businessName: "Toko", ownerName: "Budi", email: "budi@example.test", slug: "toko", accessCode: "rahasia", status: "active", createdAt: "now" })
  assert.equal("accessCode" in merchant, false)
  assert.equal("email" in merchant, false)
  assert.equal(merchant.slug, "toko")
})
