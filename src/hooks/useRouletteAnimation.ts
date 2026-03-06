import { useRef, useCallback } from 'react'

interface AnimationConfig {
  finalAmount: number
  equalShare: number
  rangeMin: number
  rangeMax: number
  onUpdate: (amount: number) => void
  onComplete: (amount: number) => void
  playTick: () => void
  playDrum: () => void
  playFanfare: () => void
}

function ceilTo100(n: number): number {
  return Math.ceil(n / 100) * 100
}

function floorTo100(n: number): number {
  return Math.floor(n / 100) * 100
}

function randomAmountInRange(equalShare: number, rangeMin: number, rangeMax: number): number {
  const min = ceilTo100(equalShare * rangeMin)
  const max = floorTo100(equalShare * rangeMax)
  const steps = Math.max(0, Math.floor((max - min) / 100))
  return min + Math.floor(Math.random() * (steps + 1)) * 100
}

export function useRouletteAnimation() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startAnimation = useCallback((config: AnimationConfig) => {
    const { finalAmount, equalShare, rangeMin, rangeMax, onUpdate, onComplete, playTick, playDrum, playFanfare } = config

    let elapsed = 0
    const phase1End = 1500
    const phase2End = 2500
    const phase3End = 3500

    playDrum()

    function tick() {
      if (elapsed < phase1End) {
        // Phase 1: 高速切替 50ms間隔
        const randomVal = randomAmountInRange(equalShare, rangeMin, rangeMax)
        onUpdate(randomVal)
        playTick()
        elapsed += 50
        timerRef.current = setTimeout(tick, 50)
      } else if (elapsed < phase2End) {
        // Phase 2: 減速 50ms→400ms
        const progress = (elapsed - phase1End) / (phase2End - phase1End)
        const interval = 50 + progress * 350
        const randomVal = randomAmountInRange(equalShare, rangeMin, rangeMax)
        onUpdate(randomVal)
        playTick()
        elapsed += interval
        timerRef.current = setTimeout(tick, interval)
      } else if (elapsed < phase3End) {
        // Phase 3: 最終値付近で揺れ
        const progress = (elapsed - phase2End) / (phase3End - phase2End)
        const interval = 300 + progress * 200
        // 最終値付近（±200円）で揺れる
        const jitter = (Math.random() - 0.5) * 400
        const nearFinal = Math.round((finalAmount + jitter) / 100) * 100
        onUpdate(Math.max(0, nearFinal))
        playTick()
        elapsed += interval
        timerRef.current = setTimeout(tick, interval)
      } else {
        // Phase 4: 確定
        onUpdate(finalAmount)
        playFanfare()
        onComplete(finalAmount)
      }
    }

    tick()
  }, [])

  const stopAnimation = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  return { startAnimation, stopAnimation }
}
