import Calculator from "./Calculator.js"
import History from "./History.js"
import Controller from "./Controller.js"
import Display from "./Display.js"
import Memory from "./Memory.js"

new Controller(new Calculator, new Display, new History, new Memory)