import { addClient, removeClient } from "@/lib/sse"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Optional: you can force response streaming
export const preferredRegion = 'auto'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const merchantId = searchParams.get("merchantId") || undefined
  const clientId = Math.random().toString(36).substring(2, 11)

  const stream = new ReadableStream({
    start(controller) {
      const client = { id: clientId, controller, merchantId }
      addClient(client)

      // Send initial heartbeat
      const hello = `data: ${JSON.stringify({ type: "connected", clientId })}\n\n`
      controller.enqueue(new TextEncoder().encode(hello))

      // Keep-alive heartbeat every 25 seconds to prevent connection timeout
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(`: heartbeat\n\n`))
        } catch {
          clearInterval(heartbeat)
          removeClient(client)
        }
      }, 25000)

      // Cleanup on abort
      req.signal.addEventListener("abort", () => {
        clearInterval(heartbeat)
        removeClient(client)
        try { controller.close() } catch { /* already closed */ }
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}
