export type Screen = 'input' | 'roulette' | 'result'

export interface RangePreset {
  label: string
  min: number
  max: number
}

export interface RouletteResult {
  personIndex: number
  amount: number
  isOrganizer: boolean
}

export interface AppState {
  screen: Screen
  totalAmount: number
  numPeople: number
  rangeMin: number
  rangeMax: number
  results: RouletteResult[]
  currentPerson: number
  isSpinning: boolean
  displayAmount: number
}

export type AppAction =
  | { type: 'SET_TOTAL_AMOUNT'; payload: number }
  | { type: 'SET_NUM_PEOPLE'; payload: number }
  | { type: 'SET_RANGE'; payload: { min: number; max: number } }
  | { type: 'START_ROULETTE' }
  | { type: 'START_SPIN' }
  | { type: 'UPDATE_DISPLAY'; payload: number }
  | { type: 'FINISH_SPIN'; payload: number }
  | { type: 'NEXT_PERSON' }
  | { type: 'SHOW_RESULT' }
  | { type: 'RESET' }
