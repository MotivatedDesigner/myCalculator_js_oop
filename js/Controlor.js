export default class Controlor{
  constructor(calculator, display) {
    this.calculator = calculator
    this.display = display
    this.operatorButtons = document.querySelectorAll('.operator')
    this.numberButtons = document.querySelectorAll('.number')
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
    this.clearButton.addEventListener('click', this.clearHandler) 
    // document.addEventListener('keydown', this.keyboardHandler)
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
        this.calculator.operand1 = event.target.value
        this.calculator.setState('get-operand1')
        break
    }
  }
  inputOperatorHandler = (event) => {
    switch(this.calculator.getState()) {
      case 'get-operand1':
        this.calculator.setState('get-operator')
        break
      case 'get-operand2':
        console.log(`this.calculator.getState()`, this.calculator.getState())
        this.calculator.evaluate()
        case 'get-operand2':
        case 'evaluate':
        console.log(`this.calculator.getState()`, this.calculator.getState())
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
      this.display.displayExpresion(this.calculator.getElements(), 'full')
      this.calculator.clearOperands()
      this.calculator.setState('evaluate')
    }
  }
  clearHandler = () => {
    this.calculator.clearState()
    this.display.clear()
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