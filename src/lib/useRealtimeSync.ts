"use client"

import { useEffect, useRef, useState } from "react"

export type ConnectionType = "sse" | "local" | "connecting"

export function useRealtimeSync(merchantId: string | undefined, onUpdate: () => void) {
  const onUpdateRef = useRef(onUpdate)
  const [connectionType, setConnectionType] = useState<ConnectionType>("connecting")

  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  useEffect(() => {
    if (!merchantId) return

    let eventSource: EventSource | null = null
    let isCleanedUp = false
    let fallbackTimeout: number | undefined
    let reconnectTimeout: number | undefined

    const connect = () => {
      eventSource?.close()
      eventSource = new EventSource(`/api/events?merchantId=${encodeURIComponent(merchantId)}`)

      eventSource.onopen = () => {
        if (isCleanedUp) return
        setConnectionType("sse")
        onUpdateRef.current()
      }

      eventSource.onmessage = (event) => {
        if (isCleanedUp) return
        try {
          const data = JSON.parse(event.data)
          if (data.type === "tickets_updated" || data.type === "connected") onUpdateRef.current()
        } catch {
          // Ignore malformed server push payload.
        }
      }

      eventSource.onerror = () => {
        if (isCleanedUp) return
        setConnectionType("local")
        eventSource?.close()
        reconnectTimeout = window.setTimeout(connect, 2000)
      }
    }

    try {
      connect()
    } catch {
      fallbackTimeout = window.setTimeout(() => setConnectionType("local"), 0)
    }

    const handleLocalUpdate = () => onUpdateRef.current()
    window.addEventListener("storage", handleLocalUpdate)
    window.addEventListener("qlite_update_qlite_tickets", handleLocalUpdate)
    window.addEventListener("qlite_storage_change", handleLocalUpdate)

    return () => {
      isCleanedUp = true
      if (fallbackTimeout) window.clearTimeout(fallbackTimeout)
      if (reconnectTimeout) window.clearTimeout(reconnectTimeout)
      eventSource?.close()
      window.removeEventListener("storage", handleLocalUpdate)
      window.removeEventListener("qlite_update_qlite_tickets", handleLocalUpdate)
      window.removeEventListener("qlite_storage_change", handleLocalUpdate)
    }
  }, [merchantId])

  return { connectionType }
}
