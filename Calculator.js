export default class Calculator {
  constructor(history) {
    this.history = history


    this.clearState()
    // this.disableControlls()
  } 

  clearOperands() {
    this.operand1 = ''
    this.operand2 = ''
  }
  clearState = _ => {
    this.clearOperands()
    this.operator = undefined
    this.result = ''
    this.state = 'clear'
    // this.resultDisplay.value = 0
    // this.expresionDisplay.value = ''
  }

  saveStateToHistory() {
    this.history.save({
      operand1: this.operand1,
      operand2: this.operand2,
      operator: this.operator,
      result: this.result,
      state: this.state,
    })
  }
  setStateFromHistory(state) {
    this.operand1 = state.operand1
    this.operand2 = state.operand2
    this.operator = state.operator
    this.result = state.result
    this.state = state.state
  }

  getState() {
    return this.state
  }
  inputOperatorHandler = (event) => {
    switch(this.state) {
      case 'get-operand1':
        this.state = 'get-operator'
        this.operator = event.target.value
        this.displayHalfExpresion()
        break
      case 'get-operator':
        this.operator = event.target.value
        // this.displayHalfExpresion()
        break
      case 'get-operand2':
        this.evaluate()
        this.state = 'get-operator'
        this.operand1 = this.result
        this.operator = event.target.value
        // this.displayHalfExpresion()
        break
      case 'evaluate':
        this.operand1 = this.result
        this.state = 'get-operator'
        this.operator = event.target.value
        // this.displayHalfExpresion()
    }
  } 
  evaluateHandler = _ => {
    if(this.state === 'get-operand2') {
      this.evaluate()
      this.displayFullExpresion()
      this.clearOperands()
      this.state = 'evaluate'
    }
  }
  keyboardHandler = (event) => {
    if (event.keyCode == 90 && event.ctrlKey) {
      let historyState = this.history.undo()
      if(historyState == undefined) return
      // if(this.state != 'clear') this.saveStateToHistory()
      this.setStateFromHistory(historyState)
      this.displayFullExpresion()
      console.log(`this.history`, this.history)
    }
    if (event.keyCode == 89 && event.ctrlKey) {
      let historyState = this.history.redo()
      if(historyState == undefined) return
      this.setStateFromHistory(historyState)
      this.displayFullExpresion()
      console.log(`this.history`, this.history)
    }
  }

  evaluate() {
    this.result = eval(`${this.operand1} ${this.operator} ${this.operand2}`)
    this.resultDisplay.value = this.result
    this.saveStateToHistory()
  }

  displayHalfExpresion() {
    this.expresionDisplay.value = `${this.operator} ${this.result == undefined ? this.result : this.operand1}`
  }
  displayFullExpresion() {
    this.expresionDisplay.value = ` = ${this.operand2}  ${this.operator} ${this.operand1} `
  }

  enableControlls() {
    this.operatorButtons.forEach( operator => operator.classList.remove('inactive') )
    this.evaluateButton.classList.remove('inactive')
  }
  disableControlls() {
    this.operatorButtons.forEach( operator => operator.classList.add('inactive') )
    this.evaluateButton.classList.add('inactive')
  }

  showState() {
    console.log(`this.operand1`, this.operand1)
    console.log(`this.operand2`, this.operand2)
    console.log(`this.operator`, this.operator)
    console.log(`this.result`, this.result)
    console.log(`this.state`, this.state)
  }
}