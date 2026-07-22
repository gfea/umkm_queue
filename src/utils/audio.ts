"use client"

export type HapticType = "tap" | "success" | "alert"

/** Trigger device vibration where supported. iOS Safari currently ignores Vibration API. */
export function haptic(type: HapticType = "tap") {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return false
  const pattern = type === "alert" ? [180, 90, 180, 90, 320] : type === "success" ? [70, 45, 140] : 35
  return navigator.vibrate(pattern)
}

/** Request browser notification permission from a user gesture. */
export async function enableNotifications() {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported" as const
  if (Notification.permission === "granted") return "granted" as const
  if (Notification.permission === "denied") return "denied" as const
  return Notification.requestPermission()
}

/** Show status notification while page is open or backgrounded. */
export function notifyQueue(title: string, body: string, tag: string) {
  if (typeof window === "undefined" || !("Notification" in window) || Notification.permission !== "granted") return false
  const notification = new Notification(title, { body, icon: "/logo.jpg", badge: "/logo.jpg", tag } as NotificationOptions)
  notification.onclick = () => { window.focus(); notification.close() }
  return true
}

/**
 * Plays a pleasant chime / notification tone using Web Audio API
 */
export function playChime(type: "success" | "ready" | "click" = "ready") {
  if (typeof window === "undefined") return
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()

    if (type === "click") {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(440, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05)
      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.05)
      return
    }

    if (type === "success") {
      const notes = [523.25, 659.25, 783.99] // C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = "triangle"
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08)
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.08)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime + idx * 0.08)
        osc.stop(ctx.currentTime + idx * 0.08 + 0.3)
      })
      return
    }

    // Ready alert chime
    const freqs = [659.25, 880, 1046.5] // E5, A5, C6
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12)
      gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.12)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.4)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime + idx * 0.12)
      osc.stop(ctx.currentTime + idx * 0.12 + 0.4)
    })

    // Haptic feedback
    haptic(type === "ready" ? "alert" : "success")
  } catch {
    // Ignore audio autoplay restrictions or un-supported contexts gracefully
  }
}
