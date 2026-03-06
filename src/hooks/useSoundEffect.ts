import { useRef, useCallback } from 'react'

export function useSoundEffect() {
  const ctxRef = useRef<AudioContext | null>(null)

  const getContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
    }
    return ctxRef.current
  }, [])

  const playTick = useCallback(() => {
    try {
      const ctx = getContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 800 + Math.random() * 400
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.05)
    } catch {
      // Audio not available
    }
  }, [getContext])

  const playDrum = useCallback(() => {
    try {
      const ctx = getContext()
      // ドラムロール風
      for (let i = 0; i < 20; i++) {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = 150
        osc.type = 'triangle'
        const t = ctx.currentTime + i * 0.08
        gain.gain.setValueAtTime(0.05, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06)
        osc.start(t)
        osc.stop(t + 0.06)
      }
    } catch {
      // Audio not available
    }
  }, [getContext])

  const playFanfare = useCallback(() => {
    try {
      const ctx = getContext()
      const notes = [523, 659, 784, 1047] // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        osc.type = 'square'
        const t = ctx.currentTime + i * 0.15
        gain.gain.setValueAtTime(0.1, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
        osc.start(t)
        osc.stop(t + 0.3)
      })
    } catch {
      // Audio not available
    }
  }, [getContext])

  const playReveal = useCallback(() => {
    try {
      const ctx = getContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(400, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3)
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.5)
    } catch {
      // Audio not available
    }
  }, [getContext])

  return { playTick, playDrum, playFanfare, playReveal }
}
