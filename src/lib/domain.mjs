export function normalizeSlug(value) {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  if (!slug) throw new Error("Nama UMKM wajib diisi")
  return slug
}

export function buildQueueUrl(origin, businessName) {
  return `${origin.replace(/\/$/, "")}/q/${normalizeSlug(businessName)}`
}
