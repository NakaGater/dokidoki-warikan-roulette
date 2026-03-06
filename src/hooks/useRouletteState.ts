import { useReducer, useCallback } from 'react'
import type { AppState, AppAction } from '../types'

const initialState: AppState = {
  screen: 'input',
  totalAmount: 10000,
  numPeople: 4,
  rangeMin: 0,
  rangeMax: 2,
  results: [],
  currentPerson: 0,
  isSpinning: false,
  displayAmount: 0,
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_TOTAL_AMOUNT':
      return { ...state, totalAmount: action.payload }
    case 'SET_NUM_PEOPLE':
      return { ...state, numPeople: action.payload }
    case 'SET_RANGE':
      return { ...state, rangeMin: action.payload.min, rangeMax: action.payload.max }
    case 'START_ROULETTE':
      return {
        ...state,
        screen: 'roulette',
        results: [],
        currentPerson: 0,
        isSpinning: false,
        displayAmount: 0,
      }
    case 'START_SPIN':
      return { ...state, isSpinning: true }
    case 'UPDATE_DISPLAY':
      return { ...state, displayAmount: action.payload }
    case 'FINISH_SPIN':
      return {
        ...state,
        isSpinning: false,
        displayAmount: action.payload,
        results: [
          ...state.results,
          {
            personIndex: state.currentPerson,
            amount: action.payload,
            isOrganizer: state.currentPerson === state.numPeople - 1,
          },
        ],
      }
    case 'NEXT_PERSON':
      return {
        ...state,
        currentPerson: state.currentPerson + 1,
        displayAmount: 0,
      }
    case 'SHOW_RESULT':
      return { ...state, screen: 'result' }
    case 'RESET':
      return { ...initialState, totalAmount: state.totalAmount, numPeople: state.numPeople, rangeMin: state.rangeMin, rangeMax: state.rangeMax }
    default:
      return state
  }
}

export function useRouletteState() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setTotalAmount = useCallback((amount: number) => {
    dispatch({ type: 'SET_TOTAL_AMOUNT', payload: amount })
  }, [])

  const setNumPeople = useCallback((num: number) => {
    dispatch({ type: 'SET_NUM_PEOPLE', payload: num })
  }, [])

  const setRange = useCallback((min: number, max: number) => {
    dispatch({ type: 'SET_RANGE', payload: { min, max } })
  }, [])

  const startRoulette = useCallback(() => {
    dispatch({ type: 'START_ROULETTE' })
  }, [])

  const startSpin = useCallback(() => {
    dispatch({ type: 'START_SPIN' })
  }, [])

  const updateDisplay = useCallback((amount: number) => {
    dispatch({ type: 'UPDATE_DISPLAY', payload: amount })
  }, [])

  const finishSpin = useCallback((amount: number) => {
    dispatch({ type: 'FINISH_SPIN', payload: amount })
  }, [])

  const nextPerson = useCallback(() => {
    dispatch({ type: 'NEXT_PERSON' })
  }, [])

  const showResult = useCallback(() => {
    dispatch({ type: 'SHOW_RESULT' })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  return {
    state,
    setTotalAmount,
    setNumPeople,
    setRange,
    startRoulette,
    startSpin,
    updateDisplay,
    finishSpin,
    nextPerson,
    showResult,
    reset,
  }
}
