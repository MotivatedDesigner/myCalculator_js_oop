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
    this.popup.addEventListener('click', this.popupHandler) 
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
    document.getElementById('history').addEventListener('click', this.historyHandler) 
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
        this.fillPopup('memory')
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
    if(event.target.classList.contains('popup'))
      event.target.classList.remove('show')
    else if(event.target.tagName === 'svg') {
      this[event.target.dataset.from].clear()
      this.popup.querySelector('.content').innerHTML = ''
      this.popup.querySelector('.trash').innerHTML = ''
      return
    }
    if(event.target.tagName === 'INPUT') {
      this.memoryHandler({
        target: { 
          value: event.target.value,
          index: event.target.closest('.memory-control').dataset.index
        }
      })
      this.fillPopup('memory')
    }
  }
  historyHandler = () => {
    this.popup.classList.add('show')
    this.fillPopup('history')
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

  fillPopup = (from) => {
    let contentHtml = '', trashHtml = ''

    if(from === 'memory')
      contentHtml = this.memory.getAll().map( (el, i) => 
        `<div class="memory-item hover2" >
          <h1>${el}</h1>
          <div class="memory-control" data-index="${i}">
            <input class="pink" type="button" value="MC">
            <input class="pink" type="button" value="M+">
            <input class="pink" type="button" value="M-">
          </div>
        </div>`  
      ).reverse().join(' ')
    else if(from === 'history')
      contentHtml = this.history.getAll().map( (el, i) => 
      `<div class="history-item hover2" data-index="${i}" >
        <p>${el.operand1}  ${el.operator}  ${el.operand2} = </p>
        <h2>${el.result}</h2>
      </div>`  
      ).reverse().join(' ')      

    if(contentHtml) trashHtml = `<svg data-from="${from}" aria-hidden="true" focusable="false" data-prefix="fa-light" data-icon="trash-can" class="svg-inline--fa fa-trash-can fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80C168.9 0 154.6 7.125 145.6 19.25L112 64h-96C7.201 64 0 71.2 0 80c0 8.799 7.201 16 16 16h416c8.801 0 16-7.201 16-16C448 71.2 440.8 64 432 64zM152 64l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152zM400 128C391.2 128 384 135.2 384 144v288c0 26.47-21.53 48-48 48h-224C85.53 480 64 458.5 64 432v-288C64 135.2 56.84 128 48 128S32 135.2 32 144v288C32 476.1 67.89 512 112 512h224c44.11 0 80-35.89 80-80v-288C416 135.2 408.8 128 400 128zM144 416V192c0-8.844-7.156-16-16-16S112 183.2 112 192v224c0 8.844 7.156 16 16 16S144 424.8 144 416zM240 416V192c0-8.844-7.156-16-16-16S208 183.2 208 192v224c0 8.844 7.156 16 16 16S240 424.8 240 416zM336 416V192c0-8.844-7.156-16-16-16S304 183.2 304 192v224c0 8.844 7.156 16 16 16S336 424.8 336 416z" fill="currentColor"/></svg>`
    
    this.popup.querySelector('.content').innerHTML = contentHtml
    this.popup.querySelector('.trash').innerHTML = trashHtml
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