import { useRouletteState } from './hooks/useRouletteState'
import { InputScreen } from './components/InputScreen'
import { RouletteScreen } from './components/RouletteScreen'
import { ResultScreen } from './components/ResultScreen'

export default function App() {
  const {
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
  } = useRouletteState()

  switch (state.screen) {
    case 'input':
      return (
        <InputScreen
          totalAmount={state.totalAmount}
          numPeople={state.numPeople}
          rangeMin={state.rangeMin}
          rangeMax={state.rangeMax}
          onTotalAmountChange={setTotalAmount}
          onNumPeopleChange={setNumPeople}
          onRangeChange={setRange}
          onStart={startRoulette}
        />
      )
    case 'roulette':
      return (
        <RouletteScreen
          totalAmount={state.totalAmount}
          numPeople={state.numPeople}
          rangeMin={state.rangeMin}
          rangeMax={state.rangeMax}
          currentPerson={state.currentPerson}
          results={state.results}
          isSpinning={state.isSpinning}
          displayAmount={state.displayAmount}
          onStartSpin={startSpin}
          onUpdateDisplay={updateDisplay}
          onFinishSpin={finishSpin}
          onNextPerson={nextPerson}
          onShowResult={showResult}
        />
      )
    case 'result':
      return (
        <ResultScreen
          totalAmount={state.totalAmount}
          numPeople={state.numPeople}
          results={state.results}
          onReset={reset}
        />
      )
  }
}
