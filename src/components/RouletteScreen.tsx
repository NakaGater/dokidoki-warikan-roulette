import { useCallback, useEffect, useState } from 'react'
import { RouletteDisplay } from './RouletteDisplay'
import { useRouletteAnimation } from '../hooks/useRouletteAnimation'
import { useSoundEffect } from '../hooks/useSoundEffect'
import { generateAmountForPerson } from '../utils/calculator'
import type { RouletteResult } from '../types'

interface Props {
  totalAmount: number
  numPeople: number
  rangeMin: number
  rangeMax: number
  currentPerson: number
  results: RouletteResult[]
  isSpinning: boolean
  displayAmount: number
  onStartSpin: () => void
  onUpdateDisplay: (amount: number) => void
  onFinishSpin: (amount: number) => void
  onNextPerson: () => void
  onShowResult: () => void
}

export function RouletteScreen({
  totalAmount,
  numPeople,
  rangeMin,
  rangeMax,
  currentPerson,
  results,
  isSpinning,
  displayAmount,
  onStartSpin,
  onUpdateDisplay,
  onFinishSpin,
  onNextPerson,
  onShowResult,
}: Props) {
  const { startAnimation, stopAnimation } = useRouletteAnimation()
  const { playTick, playDrum, playFanfare, playReveal } = useSoundEffect()
  const [settled, setSettled] = useState(false)
  const [organizerRevealed, setOrganizerRevealed] = useState(false)

  const isOrganizer = currentPerson === numPeople - 1
  const hasCurrentResult = results.length > currentPerson
  const isLast = currentPerson === numPeople - 1
  const remaining = totalAmount - results.reduce((sum, r) => sum + r.amount, 0)
  const equalShare = totalAmount / numPeople

  useEffect(() => {
    setSettled(false)
    setOrganizerRevealed(false)
  }, [currentPerson])

  useEffect(() => {
    return () => stopAnimation()
  }, [stopAnimation])

  const handleSpin = useCallback(() => {
    const currentAmounts = results.map((r) => r.amount)
    const finalAmount = generateAmountForPerson(
      totalAmount,
      numPeople,
      rangeMin,
      rangeMax,
      currentAmounts,
    )

    onStartSpin()
    startAnimation({
      finalAmount,
      equalShare,
      rangeMin,
      rangeMax,
      onUpdate: onUpdateDisplay,
      onComplete: (amount) => {
        onFinishSpin(amount)
        setSettled(true)
      },
      playTick,
      playDrum,
      playFanfare,
    })
  }, [
    results, totalAmount, numPeople, rangeMin, rangeMax, equalShare,
    onStartSpin, onUpdateDisplay, onFinishSpin,
    startAnimation, playTick, playDrum, playFanfare,
  ])

  const handleOrganizerReveal = useCallback(() => {
    const organizerAmount = remaining
    playReveal()
    setOrganizerRevealed(true)
    setTimeout(() => {
      onFinishSpin(organizerAmount)
      setSettled(true)
      playFanfare()
    }, 1500)
    // 演出のため段階的に表示
    let step = 0
    const interval = setInterval(() => {
      step++
      if (step < 10) {
        const randomVal = Math.round((organizerAmount + (Math.random() - 0.5) * 2000) / 100) * 100
        onUpdateDisplay(Math.max(0, randomVal))
      } else {
        onUpdateDisplay(organizerAmount)
        clearInterval(interval)
      }
    }, 120)
  }, [remaining, playReveal, playFanfare, onFinishSpin, onUpdateDisplay])

  return (
    <div className="min-h-dvh bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 flex flex-col">
      <div className="flex-1 flex flex-col items-center p-4 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="text-center mt-4 mb-2 animate-fade-in">
          <p className="text-white/70 text-sm">
            {totalAmount.toLocaleString()}円を{numPeople}人で割り勘
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            {isOrganizer ? (
              <span className="text-yellow-300">幹事さんの番！</span>
            ) : (
              <>第<span className="text-yellow-300">{currentPerson + 1}</span>/{numPeople}人目の挑戦者</>
            )}
          </h2>
        </div>

        {/* Roulette Display */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="w-full bg-white/10 backdrop-blur-sm rounded-3xl p-6">
            {isOrganizer && !organizerRevealed && !hasCurrentResult ? (
              <div className="text-center py-8 space-y-4">
                <p className="text-white text-lg">
                  幹事さんの支払い額は...
                </p>
                <p className="text-white/60 text-sm">
                  残り <span className="text-yellow-300 font-bold">¥{remaining.toLocaleString()}</span>
                </p>
                <button
                  onClick={handleOrganizerReveal}
                  className="px-8 py-4 rounded-2xl bg-yellow-400 text-purple-900 text-xl font-black shadow-lg shadow-yellow-400/30 hover:bg-yellow-300 transition-all active:scale-95 animate-pulse-slow"
                >
                  金額を見る！
                </button>
              </div>
            ) : (
              <RouletteDisplay
                amount={displayAmount}
                isSpinning={isSpinning}
                isFinished={settled}
              />
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full py-4 space-y-3">
          {!hasCurrentResult && !isOrganizer && (
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className={`
                w-full px-8 py-4 rounded-2xl text-xl font-black transition-all active:scale-95
                ${isSpinning
                  ? 'bg-white/20 text-white/40 cursor-not-allowed'
                  : 'bg-yellow-400 text-purple-900 shadow-lg shadow-yellow-400/30 hover:bg-yellow-300 animate-pulse-slow'
                }
              `}
            >
              {isSpinning ? 'ルーレット回転中...' : 'ルーレットを回す！'}
            </button>
          )}

          {settled && !isLast && (
            <button
              onClick={onNextPerson}
              className="w-full px-8 py-4 rounded-2xl bg-white/20 text-white text-lg font-bold hover:bg-white/30 transition-all active:scale-95 animate-slide-up"
            >
              次の人へ →
            </button>
          )}

          {settled && isLast && (
            <button
              onClick={onShowResult}
              className="w-full px-8 py-4 rounded-2xl bg-yellow-400 text-purple-900 text-xl font-black shadow-lg shadow-yellow-400/30 hover:bg-yellow-300 transition-all active:scale-95 animate-slide-up"
            >
              結果発表！
            </button>
          )}
        </div>

        {/* Results so far */}
        {results.length > 0 && (
          <div className="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4 animate-fade-in">
            <h3 className="text-white/70 text-xs font-semibold mb-2">これまでの結果</h3>
            <div className="space-y-1">
              {results.map((r) => (
                <div key={r.personIndex} className="flex justify-between text-sm">
                  <span className="text-white/80">
                    {r.personIndex + 1}人目
                    {r.isOrganizer && <span className="text-yellow-300 ml-1">👑幹事</span>}
                  </span>
                  <span className="text-white font-bold">¥{r.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-white/20 flex justify-between text-sm">
              <span className="text-white/60">残り金額</span>
              <span className="text-yellow-300 font-bold">
                ¥{(totalAmount - results.reduce((s, r) => s + r.amount, 0)).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
