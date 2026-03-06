import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  color: string
  duration: number
  delay: number
  size: number
  shape: 'square' | 'circle'
}

const COLORS = [
  'bg-red-400', 'bg-yellow-400', 'bg-green-400', 'bg-blue-400',
  'bg-pink-400', 'bg-purple-400', 'bg-orange-400', 'bg-cyan-400',
]

export function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 1.5,
      size: 6 + Math.random() * 8,
      shape: Math.random() > 0.5 ? 'square' : 'circle',
    }))
    setPieces(newPieces)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className={`confetti-piece ${piece.color} ${
            piece.shape === 'circle' ? 'rounded-full' : 'rounded-sm'
          }`}
          style={{
            '--x': `${piece.x}%`,
            '--duration': `${piece.duration}s`,
            '--delay': `${piece.delay}s`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
