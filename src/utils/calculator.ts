/**
 * 制約付きランダム分配アルゴリズム
 * - 各人の金額は均等額 × (rangeMin 〜 rangeMax) の範囲内
 * - 100円単位に丸め
 * - 非幹事は切り上げ方向で丸め、幹事（最後の人）が残額を負担
 */

function ceilTo100(n: number): number {
  return Math.ceil(n / 100) * 100
}

function floorTo100(n: number): number {
  return Math.floor(n / 100) * 100
}

export function calculateSingleAmount(
  remaining: number,
  remainingPeople: number,
  equalShare: number,
  rangeMin: number,
  rangeMax: number,
): number {
  const minAmount = ceilTo100(equalShare * rangeMin)
  const maxAmount = floorTo100(equalShare * rangeMax)

  // 残りの人数（この人を除いた未来の人数、幹事を除く）
  const futureNonOrg = remainingPeople - 2 // -1 for this person, -1 for organizer
  const futureMin = futureNonOrg > 0 ? ceilTo100(equalShare * rangeMin) : 0
  const futureMax = futureNonOrg > 0 ? floorTo100(equalShare * rangeMax) : 0

  // 実行可能範囲の計算
  // 残りの人が最大を払った場合のこの人の最小額
  const feasibleMin = Math.max(
    minAmount,
    ceilTo100(remaining - (futureNonOrg > 0 ? futureNonOrg * futureMax : 0) - floorTo100(equalShare * rangeMax)),
  )
  // 残りの人が最小を払った場合のこの人の最大額
  const feasibleMax = Math.min(
    maxAmount,
    floorTo100(remaining - (futureNonOrg > 0 ? futureNonOrg * futureMin : 0) - ceilTo100(equalShare * rangeMin)),
  )

  if (feasibleMin > feasibleMax) {
    // フォールバック: 均等割り
    return ceilTo100(remaining / remainingPeople)
  }

  // 100円単位のランダム選択
  const steps = Math.floor((feasibleMax - feasibleMin) / 100)
  const randomStep = Math.floor(Math.random() * (steps + 1))
  return feasibleMin + randomStep * 100
}

export function generateAllAmounts(
  totalAmount: number,
  numPeople: number,
  rangeMin: number,
  rangeMax: number,
): number[] {
  const equalShare = totalAmount / numPeople
  const amounts: number[] = []
  let remaining = totalAmount

  for (let i = 0; i < numPeople - 1; i++) {
    const remainingPeople = numPeople - i
    const amount = calculateSingleAmount(
      remaining,
      remainingPeople,
      equalShare,
      rangeMin,
      rangeMax,
    )
    amounts.push(amount)
    remaining -= amount
  }

  // 幹事（最後の人）は残額
  amounts.push(remaining)
  return amounts
}

export function generateAmountForPerson(
  totalAmount: number,
  numPeople: number,
  rangeMin: number,
  rangeMax: number,
  currentResults: number[],
): number {
  const equalShare = totalAmount / numPeople
  const remaining = totalAmount - currentResults.reduce((sum, a) => sum + a, 0)
  const remainingPeople = numPeople - currentResults.length

  if (remainingPeople <= 1) {
    // 幹事: 残額をそのまま
    return remaining
  }

  return calculateSingleAmount(
    remaining,
    remainingPeople,
    equalShare,
    rangeMin,
    rangeMax,
  )
}
