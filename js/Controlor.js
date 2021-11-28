export default class Controlor{
  constructor(calculator, display, history) {
    this.calculator = calculator
    this.display = display
    this.history = history

    this.operatorButtons = document.querySelectorAll('.operator')
    this.numberButtons = document.querySelectorAll('.number')
    this.dotButton = document.getElementById('dot')
    this.evaluateButton = document.getElementById('evaluate')
    this.clearButton = document.getElementById('clear')

    this.initialize()
  }

  initialize = () => {
    this.operatorButtons.forEach( 
      operator => operator.addEventListener('click', this.inputOperatorHandler) 
    )
    this.numberButtons.forEach( 
      number => number.addEventListener('click', this.inputNumberHandler) 
    )
    this.evaluateButton.addEventListener('click', this.evaluateHandler) 
    this.dotButton.addEventListener('click', this.dotHandler) 
    this.clearButton.addEventListener('click', this.clearHandler) 
    document.addEventListener('keydown', this.keyboardHandler)
  }

  inputNumberHandler = (event) => {
    switch(this.calculator.getState()) {
      case 'clear':
        this.enableControlls()
        this.calculator.setState('get-operand1')
        this.display.displayResult(this.calculator.operand1 = event.target.value)
        break
      case 'get-operand1':
        this.display.displayResult(this.calculator.operand1 += event.target.value)
        break
      case 'get-operator':
        this.calculator.setState('get-operand2')
        this.display.displayResult(this.calculator.operand2 = event.target.value)
        break
      case 'get-operand2':
        this.display.displayResult(this.calculator.operand2 += event.target.value)
        break
      case 'evaluate':
        this.calculator.setState('get-operand1')
        this.display.clear()
        this.display.displayResult(this.calculator.operand1 = event.target.value)
        break
    }
  }
  inputOperatorHandler = (event) => {
    switch(this.calculator.getState()) {
      case 'get-operand1':
        this.calculator.setState('get-operator')
        break
      case 'get-operand2':
        this.calculator.evaluate()
        this.history.store(this.calculator.getElements())
      case 'get-operand2':
      case 'evaluate':
      this.calculator.operand1 = this.calculator.result
      break
    }
    this.calculator.setState('get-operator')
    this.calculator.operator = event.target.value
    this.display.displayExpresion(this.calculator.getElements())
  }
  evaluateHandler = _ => {
    if(this.calculator.getState() === 'get-operand2') {
      this.calculator.evaluate()
      this.history.store(this.calculator.getElements())
      this.display.displayResult(this.calculator.result)
      this.display.displayExpresion(this.calculator.getElements(), 'full')
      this.calculator.clearOperands()
      this.calculator.setState('evaluate')
    }
  }
  dotHandler = _ => {
    if( this.display.getResult().includes('.') ) return
    let state = this.calculator.getState()
    if (state === 'get-operand1' || state === 'get-operand2')
      this.display.displayResult(this.calculator[state.split('-')[1]] += '.')
  }
  clearHandler = () => {  
    this.calculator.clearState()
    this.display.clear()
  }
  keyboardHandler = (event) => {
    let historyState = undefined

    if (event.keyCode == 90 && event.ctrlKey) historyState = this.history.undo()
    if (event.keyCode == 89 && event.ctrlKey) historyState = this.history.redo()

    if(historyState == undefined) return
    else {
      this.calculator.setStateFromHistory(historyState)
      this.display.displayExpresion(historyState, 'full')
      this.display.displayResult(historyState.result)
    }
  }
  
  enableControlls() {
    this.operatorButtons.forEach( operator => operator.classList.remove('inactive') )
    this.evaluateButton.classList.remove('inactive')
  }
  disableControlls() {
    this.operatorButtons.forEach( operator => operator.classList.add('inactive') )
    this.evaluateButton.classList.add('inactive')
  }
}