export default class Controller{
  constructor(calculator, display, history, memory) {
    this.calculator = calculator
    this.display = display
    this.history = history
    this.memory = memory

    this.operatorButtons = document.querySelectorAll('.operator')
    this.evaluateButton = document.getElementById('evaluate')
    this.dotButton = document.getElementById('dot')

    this.initialize()
    this.setButtonsState('inactive', ['operatorButtons','evaluateButton'])
  }

  initialize = () => {
    this.evaluateButton.addEventListener('click', this.evaluateHandler) 
    this.dotButton.addEventListener('click', this.dotHandler) 
    this.operatorButtons.forEach( 
      operator => operator.addEventListener('click', this.inputOperatorHandler) 
    )
    document.querySelectorAll('.number').forEach( 
      number => number.addEventListener('click', this.inputNumberHandler) 
    )
    document.querySelectorAll('.memory input').forEach( 
      number => number.addEventListener('click', this.memoryHandler)    
    )
    document.getElementById('clear').addEventListener('click', this.clearHandler) 
    document.getElementById('back').addEventListener('click', this.backHandler) 
    document.getElementById('clear-entry').addEventListener('click', this.clearEntryHandler) 
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
    console.log(`event.target.dataset.type`, event.target.dataset.type)
    this.calculator.operator = event.target.dataset.type
    this.calculator.setState('get-operator')
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
      this.setButtonsState('inactive', ['dotButton'])
    }
  }
  clearHandler = () => {  
    this.calculator.clearState()
    this.display.clear()
    this.setButtonsState('inactive', ['operatorButtons','evaluateButton'])
  }
  clearEntryHandler = () => {  
    let state = this.calculator.getState() 
    if(state === 'get-operand1' || state === 'get-operand2')
    {
      this.display.displayResult( this.calculator[ state.split('-')[1] ] = 0 )
      this.calculator.setState(state === 'get-operand1' ? 'clear' : 'get-operator')
    }
      // console.log(`operand.slice(0, operand.lenght-1)`, operand.slice(0, operand.lenght-1) )
      // console.log(`this.calculator[state.split('-')[1]] `, this.calculator[state.split('-')[1]])
      // // this.calculator[operand] = this.calculator[operand]
  }
  backHandler = () => {  
    let state = this.calculator.getState() 
    let operand = this.calculator[ state.split('-')[1] ]
    if(
        (state === 'get-operand1' || 
        state === 'get-operand2') 
        && operand != 0
      )
      {
        
        console.log('op',operand = operand.slice(0, operand.length-1))
        this.display.displayResult(operand)
      }

      this.display.displayResult( )
      // console.log(`operand.slice(0, operand.lenght-1)`, operand.slice(0, operand.lenght-1) )
      // console.log(`this.calculator[state.split('-')[1]] `, this.calculator[state.split('-')[1]])
      // // this.calculator[operand] = this.calculator[operand]
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
    switch (event.target.value) {
      case 'MC':
        this.memory.clear(); break
      case 'MR':
        this.display.displayResult(this.memory.peek()); break
      case 'MS':
        this.memory.push(this.display.getResult()); break
      case 'M+':
        this.memory.plus(this.display.getResult()); break
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
        this[button].forEach( operator => operator.classList[action]('inactive') )
      else 
        this[button].classList[action]('inactive')
    })
  }
}