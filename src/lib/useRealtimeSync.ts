"use client"

import { useEffect, useRef, useState } from "react"

export type ConnectionType = "connected" | "syncing"

export function useRealtimeSync(merchantId: string | undefined, onUpdate: () => void) {
  const onUpdateRef = useRef(onUpdate)
  const [connectionType, setConnectionType] = useState<ConnectionType>("syncing")
  const connectionTypeRef = useRef<ConnectionType>("syncing")

  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  useEffect(() => {
    connectionTypeRef.current = connectionType
  }, [connectionType])

  useEffect(() => {
    if (!merchantId) return

    let eventSource: EventSource | null = null
    let stopped = false
    let reconnectTimeout: number | undefined
    let pollTimer: number | undefined

    const safeUpdate = () => {
      if (!stopped) onUpdateRef.current()
    }

    const connect = () => {
      eventSource?.close()
      eventSource = new EventSource(`/api/events?merchantId=${encodeURIComponent(merchantId)}`)

      eventSource.onopen = () => {
        if (stopped) return
        setConnectionType("connected")
        safeUpdate()
      }

      eventSource.onmessage = (event) => {
        if (stopped) return
        try {
          const data = JSON.parse(event.data)
          if (data.type === "tickets_updated" || data.type === "connected") safeUpdate()
        } catch {
          // Ignore malformed payload.
        }
      }

      eventSource.onerror = () => {
        if (stopped) return
        setConnectionType("syncing")
        eventSource?.close()
        reconnectTimeout = window.setTimeout(connect, 2000)
      }
    }

    try {
      connect()
    } catch {
      // Adaptive polling below remains active when streaming cannot start.
    }

    // Adaptive Fallback Polling
    const adaptivePoll = () => {
      if (stopped) return

      // Jika SSE terputus, kita poll data. Jika konek, lewati poll HTTP.
      if (connectionTypeRef.current !== "connected") {
        safeUpdate()
      }

      // 15 detik jika tab background, 2.5 detik jika tab aktif
      const delay = document.hidden ? 15000 : 2500
      pollTimer = window.setTimeout(adaptivePoll, delay)
    }
    
    pollTimer = window.setTimeout(adaptivePoll, 2500)

    // Paksa update langsung saat user kembali ke tab ini
    const handleVisibility = () => {
      if (!document.hidden) safeUpdate()
    }
    document.addEventListener("visibilitychange", handleVisibility)

    const handleLocalUpdate = () => safeUpdate()
    window.addEventListener("storage", handleLocalUpdate)
    window.addEventListener("qlite_update_qlite_tickets", handleLocalUpdate)
    window.addEventListener("qlite_storage_change", handleLocalUpdate)

    return () => {
      stopped = true
      if (reconnectTimeout) window.clearTimeout(reconnectTimeout)
      if (pollTimer) window.clearTimeout(pollTimer)
      eventSource?.close()
      document.removeEventListener("visibilitychange", handleVisibility)
      window.removeEventListener("storage", handleLocalUpdate)
      window.removeEventListener("qlite_update_qlite_tickets", handleLocalUpdate)
      window.removeEventListener("qlite_storage_change", handleLocalUpdate)
    }
  }, [merchantId])

  return { connectionType }
}
