import type { RangePreset } from '../types'

const presets: RangePreset[] = [
  { label: '0〜2倍', min: 0, max: 2 },
  { label: '0.5〜1.5倍', min: 0.5, max: 1.5 },
  { label: '0.25〜1.75倍', min: 0.25, max: 1.75 },
]

interface Props {
  rangeMin: number
  rangeMax: number
  onRangeChange: (min: number, max: number) => void
}

export function RangeSelector({ rangeMin, rangeMax, onRangeChange }: Props) {
  const isCustom = !presets.some(p => p.min === rangeMin && p.max === rangeMax)

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-white/90">
        金額の振れ幅（均等額に対する倍率）
      </label>
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => {
          const isActive = preset.min === rangeMin && preset.max === rangeMax
          return (
            <button
              key={preset.label}
              onClick={() => onRangeChange(preset.min, preset.max)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white text-purple-700 shadow-lg scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {preset.label}
            </button>
          )
        })}
        <button
          onClick={() => {
            if (!isCustom) onRangeChange(0.3, 1.7)
          }}
          className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
            isCustom
              ? 'bg-white text-purple-700 shadow-lg scale-105'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          カスタム
        </button>
      </div>

      {isCustom && (
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="flex-1">
            <label className="block text-xs text-white/70 mb-1">最小倍率</label>
            <input
              type="number"
              step="0.05"
              min="0"
              max={rangeMax - 0.05}
              value={rangeMin}
              onChange={(e) => onRangeChange(Number(e.target.value), rangeMax)}
              className="w-full px-3 py-2 rounded-xl bg-white/20 text-white text-center text-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
          <span className="text-white/60 text-xl mt-5">〜</span>
          <div className="flex-1">
            <label className="block text-xs text-white/70 mb-1">最大倍率</label>
            <input
              type="number"
              step="0.05"
              min={rangeMin + 0.05}
              max="3"
              value={rangeMax}
              onChange={(e) => onRangeChange(rangeMin, Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-white/20 text-white text-center text-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      )}
    </div>
  )
}
