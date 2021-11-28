import Calculator from "./Calculator.js"
import History from "./History.js"
import Controlor from "./Controlor.js"
import Display from "./Display.js"

const controlor = new Controlor(new Calculator(), new Display(), new History())