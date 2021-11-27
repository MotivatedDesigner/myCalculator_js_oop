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
    // this.operatorButtons.forEach( 
    //   operator => operator.addEventListener('click', this.inputOperatorHandler) 
    // )
    this.numberButtons.forEach( 
      number => number.addEventListener('click', this.inputNumberHandler) 
    )
    // this.evaluateButton.addEventListener('click', this.calculator.evaluateHandler) 
    // this.clearButton.addEventListener('click', this.clearState) 
    // document.addEventListener('keydown', this.keyboardHandler)
  }

  inputNumberHandler = (event) => {
    switch(calculator.getState()) {
      case 'clear':
        this.enableControlls()
        calculator.setState('get-operand1')
        calculator.operand1 = event.target.value
        .value = this.operand1
        break
      case 'get-operand1':
        this.operand1 += event.target.value
        document.getElementById('result').value = this.operand1
        break
      case 'get-operator':
        this.state = 'get-operand2'
        this.operand2 = event.target.value
        document.getElementById('result').value = this.operand2
        break
      case 'get-operand2':
        this.operand2 += event.target.value
        document.getElementById('result').value = this.operand2
        break
      case 'evaluate':
        this.operand1 = event.target.value
        this.state = 'get-operand1'
        break
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