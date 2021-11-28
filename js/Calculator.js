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
  setStateFromHistory = (stateHistory) => {
    this.operand1 = stateHistory['operand1']
    this.operand2 = stateHistory['operand2']
    this.operator = stateHistory['operator']
    this.result = stateHistory['result']
  }
  getElements = () => {
    return {
      operand1: this.operand1,
      operand2: this.operand2,
      operator: this.operator,
      result: this.result
    } 
  }

  evaluate = () => this.result = eval(`${this.operand1} ${this.operator} ${this.operand2}`)
}