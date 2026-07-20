export interface QueueItem {
  id: string
  merchantId: string
  ticketNumber: string
  customerName: string
  status: "waiting" | "preparing" | "ready"
  createdAt: string
  updatedAt: string
}

export interface Merchant {
  id: string
  businessName: string
  slug: string
  createdAt: string
}
