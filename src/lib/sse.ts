// Server-side event broadcasting system for real-time push updates
// Uses SSE (Server-Sent Events) — lightweight alternative to WebSocket that works natively with Next.js

type SSEClient = {
  id: string
  controller: ReadableStreamDefaultController
  merchantId?: string
}

const sseClientsKey = "__qlite_sse_clients__"
const globalStore = globalThis as typeof globalThis & { [sseClientsKey]?: Set<SSEClient> }
const clients = globalStore[sseClientsKey] ?? new Set<SSEClient>()
globalStore[sseClientsKey] = clients

export function addClient(client: SSEClient) {
  clients.add(client)
}

export function removeClient(client: SSEClient) {
  clients.delete(client)
}

export function broadcastTicketUpdate(merchantId?: string) {
  const payload = JSON.stringify({ type: "tickets_updated", merchantId, timestamp: Date.now() })
  const message = `data: ${payload}\n\n`

  for (const client of clients) {
    // Send to all clients, or only to matching merchantId clients
    if (!merchantId || !client.merchantId || client.merchantId === merchantId) {
      try {
        client.controller.enqueue(new TextEncoder().encode(message))
      } catch {
        // Client disconnected, remove it
        clients.delete(client)
      }
    }
  }
}

export function broadcastMerchantUpdate() {
  const payload = JSON.stringify({ type: "merchants_updated", timestamp: Date.now() })
  const message = `data: ${payload}\n\n`

  for (const client of clients) {
    try {
      client.controller.enqueue(new TextEncoder().encode(message))
    } catch {
      clients.delete(client)
    }
  }
}
