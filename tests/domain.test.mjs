import test from "node:test"
import assert from "node:assert/strict"
import { buildQueueUrl, normalizeSlug } from "../src/lib/domain.mjs"

test("normalizeSlug menghasilkan slug URL aman", () => {
  assert.equal(normalizeSlug("Kopi Pagi & Roti"), "kopi-pagi-roti")
  assert.equal(normalizeSlug("  Toko__Jaya  "), "toko-jaya")
})

test("buildQueueUrl membentuk tautan antrean publik", () => {
  assert.equal(buildQueueUrl("https://antre.id/", "Kopi Pagi"), "https://antre.id/q/kopi-pagi")
})

test("slug kosong ditolak", () => {
  assert.throws(() => normalizeSlug("---"), /Nama UMKM/)
})
