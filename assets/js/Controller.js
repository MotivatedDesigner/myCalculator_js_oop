export default class Controller{
  constructor(calculator, display, history, memory) {
    this.calculator = calculator
    this.display = display
    this.history = history
    this.memory = memory

    this.operatorButtons = document.querySelectorAll('.operator')
    this.evaluateButton = document.getElementById('evaluate')
    this.dotButton = document.getElementById('dot')
    this.popup = document.querySelector('.popup')
    this.backspaceKey =  document.getElementById('back')

    this.initialize()
    this.changeButtonsState('inactive', ['operatorButtons','evaluateButton'])
  }

  initialize = () => {
    this.evaluateButton.addEventListener('click', this.evaluateHandler) 
    this.dotButton.addEventListener('click', this.dotHandler) 
    this.popup.addEventListener('click', this.removePopup) 
    this.backspaceKey.addEventListener('click', this.backHandler) 
    this.operatorButtons.forEach( 
      operator => operator.addEventListener('click', this.operatorHandler) 
    )
    document.querySelectorAll('.number').forEach( 
      number => number.addEventListener('click', this.numberHandler) 
    )
    document.querySelectorAll('.memory input').forEach( 
      number => number.addEventListener('click', this.memoryHandler)    
    )
    document.querySelector('.popup .content').addEventListener('click', this.popupHandler) 
    document.getElementById('clear').addEventListener('click', this.clearHandler) 
    document.getElementById('clear-entry').addEventListener('click', this.clearEntryHandler) 
    document.addEventListener('keydown', this.keyboardHandler)
  }

  numberHandler = (event) => {
    switch(this.calculator.getState()) {
      case 'clear':
        this.changeButtonsState('active', ['operatorButtons','evaluateButton'])
        this.calculator.setState('get-operand1')
        this.display.displayResult(this.calculator.operand1 = event.target.value)
        break
      case 'get-operand1':
        this.display.displayResult(this.calculator.operand1 += event.target.value)
        break
      case 'get-operator':
        this.calculator.setState('get-operand2')
        this.display.displayResult(this.calculator.operand2 = event.target.value)
        this.changeButtonsState('active', ['evaluateButton'])
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
  operatorHandler = (event) => {
    switch(this.calculator.getState()) {
      case 'get-operand1':
        this.calculator.setState('get-operator'); break
      case 'get-operand2':
        this.calculator.evaluate()
        this.history.store(this.calculator.getElements())
      case 'get-operand2':
      case 'evaluate':
      this.calculator.operand1 = this.calculator.result; break
    }
    this.changeButtonsState('active', ['dotButton'])
    this.calculator.operator = event.target.closest('.operator').dataset.operator
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
  memoryHandler = ( {target} ) => {
    switch (target.value) {
      case 'MC':
        this.memory.clear(target.index); break
      case 'MR':
        this.display.displayResult(this.memory.peek()); break
      case 'MS':
        this.memory.push(this.display.getResult()); break
      case 'M+':
        this.memory.plus(this.display.getResult(), target.index); break
      case 'M-':
        this.memory.minus(this.display.getResult(), target.index); break
      case 'MM':
        this.popup.classList.add('show')
        this.popup.querySelector('.content').innerHTML = this.memory.getAll().map( (el, i) => 
          `<div class="memory-item" >
            <h1>${el}</h1>
            <div class="memory-control" data-index="${i}">
              <input class="pink" type="button" value="MC">
              <input class="pink" type="button" value="M+">
              <input class="pink" type="button" value="M-">
            </div>
          </div>`  
        ).reverse().join(' ')        
        break
    }
  }
  dotHandler = _ => {
    if( this.display.getResult().includes('.') ) return

    const state = this.calculator.getState()
    if (state === 'get-operand1' || state === 'get-operand2') {
      this.display.displayResult( this.calculator[state.split('-')[1]] += '.' )
      this.changeButtonsState('inactive', ['dotButton'])
    } else if(state === 'evaluate') {
      this.display.displayResult( this.calculator.operand2 += '0.' )
      this.calculator.setState('get-operand2')
    } else if(state === 'clear') {
      this.display.displayResult( this.calculator.operand1 += '0.' )
      this.changeButtonsState('active',['operatorButtons'])
      this.changeButtonsState('inactive', ['dotButton'])
      this.calculator.setState('get-operand1')
    }
  }
  clearHandler = () => {  
    this.calculator.clearState()
    this.display.clear()
    this.changeButtonsState('inactive', ['operatorButtons','evaluateButton'])
  }
  clearEntryHandler = () => {  
    const state = this.calculator.getState() 
    if(state === 'get-operand1' || state === 'get-operand2')
    {
      this.display.displayResult( this.calculator[ state.split('-')[1] ] = 0 )
      this.calculator.setState(state === 'get-operand1' ? 'clear' : 'get-operator')
    }
  }
  backHandler = () => {  
    const state = this.calculator.getState() 
    if(state === 'get-operand1' || state === 'get-operand2') {
        const operandName = state.split('-')[1]
        const operandLength = this.calculator[operandName].length
        
        if(operandLength <= 1 || !operandLength)
          this.calculator[operandName] = ''
        else 
          this.calculator[operandName] = this.calculator[operandName].slice(0, operandLength-1)

        this.display.displayResult(this.calculator[operandName] == '' ? 0 : this.calculator[operandName])
      }
  }
  popupHandler = (event) => {
    if(event.target.tagName != 'INPUT') return
    this.memoryHandler({
      target: { 
        value: event.target.value,
        index: event.target.closest('.memory-control').dataset.index
      }
    })
    this.popup.querySelector('.content').innerHTML = this.memory.getAll().map( (el, i) => 
          `<div class="memory-item" >
            <h1>${el}</h1>
            <div class="memory-control" data-index="${i}">
              <input class="pink" type="button" value="MC">
              <input class="pink" type="button" value="M+">
              <input class="pink" type="button" value="M-">
            </div>
          </div>`  
        ).reverse().join(' ') 
  }
  keyboardHandler = (event) => {
    let historyState = undefined

    if (event.keyCode == 90 && event.ctrlKey) historyState = this.history.undo()
    if (event.keyCode == 89 && event.ctrlKey) historyState = this.history.redo()

    if(event.key === "Escape" && this.popup.classList.contains('show')) this.popup.classList.remove('show')

    if(event.keyCode == 8) {
      this.backspaceKey.classList.add('backspace')
      this.backHandler()
      setTimeout(() => this.backspaceKey.classList.remove('backspace'), 100)
    }

    if(historyState == undefined) return
    else {
      this.calculator.setStateFromHistory(historyState)
      this.display.displayExpresion(historyState, 'full')
      this.display.displayResult(historyState.result)
    }
  }
  removePopup = (event) => {
    if(event.target.classList.contains('content')) return
    event.target.classList.remove('show')
  } 

  /**
 * change the state of buttons [active, inactive].
 * 
 * @param {String} state the new state, 'active' | 'inactive'.
 * @param {String[]} buttons array of targeted buttons.
 */
  changeButtonsState = (state, buttons) => {
    const action = state === 'active' ? 'remove' : 'add'
    const disabled = state === 'active' ? false : true
    buttons.forEach( button => {
      if( this[button] instanceof NodeList )
        this[button].forEach( operator => {
          operator.classList[action]('inactive') 
          operator.disabled = disabled
        })
      else {
        this[button].classList[action]('inactive')
        this[button].disabled = disabled
      }
    })
  }
}