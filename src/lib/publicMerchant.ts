import type { Merchant } from "./db"

export type PublicMerchant = {
  id: string
  businessName: string
  slug: string
  status: string
  createdAt: string
}

export function publicMerchant(merchant: Merchant | null | undefined): PublicMerchant | null {
  if (!merchant) return null
  return {
    id: merchant.id,
    businessName: merchant.businessName,
    slug: merchant.slug,
    status: merchant.status,
    createdAt: merchant.createdAt
  }
}
