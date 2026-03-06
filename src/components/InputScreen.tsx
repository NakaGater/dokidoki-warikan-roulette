import { RangeSelector } from './RangeSelector'

interface Props {
  totalAmount: number
  numPeople: number
  rangeMin: number
  rangeMax: number
  onTotalAmountChange: (amount: number) => void
  onNumPeopleChange: (num: number) => void
  onRangeChange: (min: number, max: number) => void
  onStart: () => void
}

export function InputScreen({
  totalAmount,
  numPeople,
  rangeMin,
  rangeMax,
  onTotalAmountChange,
  onNumPeopleChange,
  onRangeChange,
  onStart,
}: Props) {
  const equalShare = totalAmount / numPeople
  const minAmount = Math.ceil((equalShare * rangeMin) / 100) * 100
  const maxAmount = Math.floor((equalShare * rangeMax) / 100) * 100
  const isValid = totalAmount > 0 && numPeople >= 2 && numPeople <= 20

  return (
    <div className="min-h-dvh bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-md mx-auto w-full">
        {/* Title */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">
            ドキドキハラハラ
          </h1>
          <h2 className="text-3xl sm:text-4xl font-black text-yellow-300">
            割り勘ルーレット
          </h2>
          <p className="text-white/70 text-sm mt-2">飲み会の支払いをもっと楽しく！</p>
        </div>

        {/* Input Card */}
        <div className="w-full bg-white/10 backdrop-blur-sm rounded-3xl p-6 space-y-5 animate-slide-up">
          {/* Total Amount */}
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">
              合計金額（円）
            </label>
            <input
              type="number"
              value={totalAmount || ''}
              onChange={(e) => onTotalAmountChange(Number(e.target.value))}
              placeholder="10000"
              className="w-full px-4 py-3 rounded-2xl bg-white/20 text-white text-2xl font-bold text-center border border-white/30 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50"
            />
          </div>

          {/* Num People */}
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">
              人数
            </label>
            <div className="flex items-center gap-4 justify-center">
              <button
                onClick={() => onNumPeopleChange(Math.max(2, numPeople - 1))}
                className="w-12 h-12 rounded-full bg-white/20 text-white text-2xl font-bold hover:bg-white/30 transition-colors active:scale-95"
              >
                −
              </button>
              <span className="text-4xl font-black text-white w-16 text-center tabular-nums">
                {numPeople}
              </span>
              <button
                onClick={() => onNumPeopleChange(Math.min(20, numPeople + 1))}
                className="w-12 h-12 rounded-full bg-white/20 text-white text-2xl font-bold hover:bg-white/30 transition-colors active:scale-95"
              >
                ＋
              </button>
              <span className="text-white/70 text-lg">人</span>
            </div>
          </div>

          {/* Range Selector */}
          <RangeSelector
            rangeMin={rangeMin}
            rangeMax={rangeMax}
            onRangeChange={onRangeChange}
          />

          {/* Preview */}
          {isValid && (
            <div className="bg-white/10 rounded-2xl p-4 text-center space-y-1 animate-fade-in">
              <p className="text-white/70 text-xs">均等割り額</p>
              <p className="text-white text-xl font-bold">
                ¥{Math.round(equalShare).toLocaleString()}
              </p>
              <p className="text-white/70 text-xs">
                各人の支払い範囲: ¥{minAmount.toLocaleString()} 〜 ¥{maxAmount.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          disabled={!isValid}
          className={`
            mt-6 w-full max-w-xs px-8 py-4 rounded-2xl text-xl font-black
            transition-all active:scale-95
            ${isValid
              ? 'bg-yellow-400 text-purple-900 shadow-lg shadow-yellow-400/30 hover:bg-yellow-300 animate-pulse-slow'
              : 'bg-white/20 text-white/40 cursor-not-allowed'
            }
          `}
        >
          スタート！
        </button>
      </div>
    </div>
  )
}
