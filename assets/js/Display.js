export default class Display{
  constructor() {
    this.resultDisplay = document.getElementById('result')
    this.expresionDisplay = document.getElementById('expresion')
  }

  getResult = () => this.resultDisplay.value
  
  displayResult = (value) => {console.log(value);this.resultDisplay.value = value}
  displayExpresion = (data, type = 'half') => {
    const {operand1, operand2, operator, result} = data
    if(type === 'half')
      this.expresionDisplay.value = `${operator} ${result == undefined ? result : operand1}`
    else if(type === 'full')
      this.expresionDisplay.value = ` = ${operand2} ${operator} ${operand1} `
  }

  clear = () => {
    this.resultDisplay.value = 0
    this.expresionDisplay.value = ''
  }
}