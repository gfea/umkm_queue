"use client"

import React, { useEffect, useState } from "react"
import QRCode from "qrcode"
import { cn } from "@/utils/cn"

export interface InstantQrCodeProps {
  value: string
  size?: number
  className?: string
  alt?: string
  logoOverlay?: boolean
}

export function InstantQrCode({
  value,
  size = 220,
  className,
  alt = "QR Code",
  logoOverlay = true,
}: InstantQrCodeProps) {
  const [dataUrl, setDataUrl] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function generate() {
      try {
        setLoading(true)
        const url = await QRCode.toDataURL(value, {
          width: size,
          margin: 1.5,
          color: {
            dark: "#090b10",
            light: "#ffffff",
          },
          errorCorrectionLevel: "H",
        })
        if (isMounted) {
          setDataUrl(url)
          setLoading(false)
        }
      } catch (err) {
        console.error("QR Code generation error:", err)
        if (isMounted) setLoading(false)
      }
    }

    generate()

    return () => {
      isMounted = false
    }
  }, [value, size])

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-2xl bg-white p-3 shadow-xl overflow-hidden border border-white/20 select-none",
        className
      )}
      style={{ width: size + 24, height: size + 24 }}
    >
      {loading || !dataUrl ? (
        <div className="flex h-full w-full items-center justify-center bg-slate-100 rounded-xl">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      ) : (
        <div className="relative flex items-center justify-center h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dataUrl}
            alt={alt}
            className="h-full w-full object-contain rounded-xl"
          />

          {/* Logo overlay badge at center */}
          {logoOverlay && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-9 w-9 rounded-xl bg-slate-950 p-1 border-2 border-white shadow-lg flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.jpg"
                  alt="Q-Lite Logo"
                  className="h-full w-full object-cover rounded-md"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
