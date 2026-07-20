import { QueueItem } from "@/types"

export interface CreateQueueRequest {
  merchantId: string
  customerName: string
}

// Service abstraction
export async function createQueueTicket(req: CreateQueueRequest): Promise<QueueItem> {
  // Ponytail: simulated network delay & API call. Replaced by direct Supabase RPC in production.
  await new Promise((resolve) => setTimeout(resolve, 300))
  
  if (!req.customerName.trim()) {
    throw new Error("Nama panggilan wajib diisi")
  }

  const ticketNumber = `A-${Math.floor(Math.random() * 90) + 10}`
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    merchantId: req.merchantId,
    ticketNumber,
    customerName: req.customerName,
    status: "waiting",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}
