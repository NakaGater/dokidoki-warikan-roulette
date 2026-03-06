interface Props {
  amount: number
  isSpinning: boolean
  isFinished: boolean
}

export function RouletteDisplay({ amount, isSpinning, isFinished }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div
        className={`
          text-6xl sm:text-7xl font-black tabular-nums tracking-tight
          transition-all duration-150
          ${isSpinning ? 'text-yellow-300 scale-100' : ''}
          ${isFinished ? 'text-yellow-300 animate-pop scale-110' : ''}
          ${!isSpinning && !isFinished ? 'text-white/40' : ''}
        `}
      >
        {amount > 0 ? `¥${amount.toLocaleString()}` : '¥---'}
      </div>
      {isSpinning && (
        <div className="mt-3 flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
