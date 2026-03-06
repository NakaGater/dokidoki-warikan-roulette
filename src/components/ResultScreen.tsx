import { useCallback } from 'react'
import { Confetti } from './Confetti'
import type { RouletteResult } from '../types'

interface Props {
  totalAmount: number
  numPeople: number
  results: RouletteResult[]
  onReset: () => void
}

export function ResultScreen({ totalAmount, numPeople, results, onReset }: Props) {
  const calculatedTotal = results.reduce((sum, r) => sum + r.amount, 0)
  const equalShare = totalAmount / numPeople
  const maxPayer = results.reduce((max, r) => (r.amount > max.amount ? r : max), results[0])
  const minPayer = results.reduce((min, r) => (r.amount < min.amount ? r : min), results[0])

  const handleShare = useCallback(async () => {
    const lines = results.map(
      (r) =>
        `${r.personIndex + 1}人目${r.isOrganizer ? '(幹事)' : ''}: ¥${r.amount.toLocaleString()}`
    )
    const text = [
      '🎰 ドキドキ割り勘ルーレット結果',
      `合計: ¥${totalAmount.toLocaleString()} / ${numPeople}人`,
      '',
      ...lines,
      '',
      `合計: ¥${calculatedTotal.toLocaleString()}`,
    ].join('\n')

    if (navigator.share) {
      try {
        await navigator.share({ text })
        return
      } catch {
        // Fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(text)
      alert('結果をクリップボードにコピーしました！')
    } catch {
      // Cannot copy
    }
  }, [results, totalAmount, numPeople, calculatedTotal])

  return (
    <div className="min-h-dvh bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 flex flex-col">
      <Confetti />
      <div className="flex-1 flex flex-col items-center p-4 max-w-md mx-auto w-full">
        {/* Title */}
        <div className="text-center mt-8 mb-6 animate-bounce-in">
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            🎉 結果発表 🎉
          </h1>
          <p className="text-white/80 text-sm mt-2">
            ¥{totalAmount.toLocaleString()} を {numPeople}人で割り勘
          </p>
        </div>

        {/* Results List */}
        <div className="w-full bg-white/20 backdrop-blur-sm rounded-3xl p-5 space-y-2 animate-slide-up">
          {results
            .slice()
            .sort((a, b) => b.amount - a.amount)
            .map((r, i) => {
              const diff = r.amount - equalShare
              const isMax = r.personIndex === maxPayer.personIndex
              const isMin = r.personIndex === minPayer.personIndex
              return (
                <div
                  key={r.personIndex}
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                    isMax
                      ? 'bg-red-500/30 ring-2 ring-red-300/50'
                      : isMin
                      ? 'bg-green-500/30 ring-2 ring-green-300/50'
                      : 'bg-white/10'
                  }`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {isMax ? '💸' : isMin ? '🍀' : r.isOrganizer ? '👑' : '🎯'}
                    </span>
                    <div>
                      <p className="text-white font-bold">
                        {r.personIndex + 1}人目
                        {r.isOrganizer && (
                          <span className="text-yellow-300 text-xs ml-1">幹事</span>
                        )}
                      </p>
                      <p className="text-white/60 text-xs">
                        {diff >= 0 ? '+' : ''}
                        {Math.round(diff).toLocaleString()}円
                      </p>
                    </div>
                  </div>
                  <p className="text-white text-xl font-black">
                    ¥{r.amount.toLocaleString()}
                  </p>
                </div>
              )
            })}
        </div>

        {/* Total Verification */}
        <div className="w-full bg-white/10 rounded-2xl p-4 mt-3 text-center animate-fade-in">
          <p className="text-white/70 text-xs">合計金額チェック</p>
          <p className="text-white text-lg font-bold">
            ¥{calculatedTotal.toLocaleString()}
            {calculatedTotal === totalAmount ? (
              <span className="text-green-300 ml-2">✓ ぴったり！</span>
            ) : (
              <span className="text-yellow-300 ml-2">
                (差額: ¥{Math.abs(calculatedTotal - totalAmount).toLocaleString()})
              </span>
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3 mt-6 mb-8">
          <button
            onClick={handleShare}
            className="w-full px-8 py-4 rounded-2xl bg-white text-orange-600 text-lg font-black shadow-lg hover:bg-white/90 transition-all active:scale-95"
          >
            結果をシェア 📤
          </button>
          <button
            onClick={onReset}
            className="w-full px-8 py-3 rounded-2xl bg-white/20 text-white text-lg font-bold hover:bg-white/30 transition-all active:scale-95"
          >
            もう一度やる 🔄
          </button>
        </div>
      </div>
    </div>
  )
}
