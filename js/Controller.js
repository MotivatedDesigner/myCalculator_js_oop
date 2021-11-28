export default class Controller{
  constructor(calculator, display, history, memory) {
    this.calculator = calculator
    this.display = display
    this.history = history
    this.memory = memory

    this.operatorButtons = document.querySelectorAll('.operator')
    this.numberButtons = document.querySelectorAll('.number')
    this.memoryButtons = document.querySelectorAll('.memory')
    this.dotButton = document.getElementById('dot')
    this.evaluateButton = document.getElementById('evaluate')
    this.clearButton = document.getElementById('clear')

    this.initialize()
    this.setButtonsState('inactive', ['operatorButtons','evaluateButton'])
  }

  initialize = () => {
    this.operatorButtons.forEach( 
      operator => operator.addEventListener('click', this.inputOperatorHandler) 
    )
    this.numberButtons.forEach( 
      number => number.addEventListener('click', this.inputNumberHandler) 
    )
    this.memoryButtons.forEach( 
      number => number.addEventListener('click', this.memoryHandler) 
    )
    this.evaluateButton.addEventListener('click', this.evaluateHandler) 
    this.dotButton.addEventListener('click', this.dotHandler) 
    this.clearButton.addEventListener('click', this.clearHandler) 
    document.addEventListener('keydown', this.keyboardHandler)
  }

  inputNumberHandler = (event) => {
    switch(this.calculator.getState()) {
      case 'clear':
        this.setButtonsState('active', ['operatorButtons','evaluateButton'])
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
        this.setButtonsState('inactive', ['operatorButtons','evaluateButton'])
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
      this.dotButton.classList.remove('inactive')
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
    if (state === 'get-operand1' || state === 'get-operand2') {
      this.display.displayResult( this.calculator[state.split('-')[1]] += '.' )
      this.dotButton.classList.add('inactive')
    }
  }
  clearHandler = () => {  
    this.calculator.clearState()
    this.display.clear()
    this.disableControlls()
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
  memoryHandler = (event) => {
    console.log(`event.target.value`, event.target.value)
    switch (event.target.value) {
      case 'MC':
        this.memory.clear(); break
      case 'MR':
        this.memory.pop(); break
      case 'MS':
        this.memory.push(this.calculator.result); break
      case 'M+':
        this.memory.plus(); break
    }
  }
  /**
 * change the state of buttons [active, inactive].
 * 
 * @param {String} state the new state, 'active' | 'inactive'.
 * @param {String[]} buttons array of targeted buttons.
 */
  setButtonsState = (state, buttons) => {
    let action = state === 'active' ? 'remove' : 'add'
    buttons.forEach( button => {
      if( this[button] instanceof NodeList )
      {
        console.log(`this[button]`, this[button])
        this[button].forEach( operator => operator.classList[action]('inactive') )
      }
      else 
        this[button].classList[action]('inactive')
    })
  }
}