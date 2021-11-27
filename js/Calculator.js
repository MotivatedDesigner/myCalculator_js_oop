export default class Calculator {
  constructor(history) {
    this.clearState()
  } 

  clearOperands = () => {
    this.operand1 = ''
    this.operand2 = ''
  }
  clearState = _ => {
    this.clearOperands()
    this.operator = undefined
    this.result = ''
    this.state = 'clear'
  }
  getState = () => this.state
  setState = (state) => this.state = state

  getElements = () => {
    return {
      operand1: this.operand1,
      operand2: this.operand2,
      operator: this.operator,
      result: this.result
    } 
  }

  evaluate = () => this.result = eval(`${this.operand1} ${this.operator} ${this.operand2}`)

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
}