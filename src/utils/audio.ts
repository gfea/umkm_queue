"use client"

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

    // Trigger haptic vibration if supported
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([150, 80, 150, 80, 250])
    }
  } catch {
    // Ignore audio autoplay restrictions or un-supported contexts gracefully
  }
}
