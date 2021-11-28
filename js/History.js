export default class History {
  constructor() {
    this.undoStack = []
    this.redoStack = []
  }
  store(state) {
    this.undoStack.push(state)
    this.redoStack = []
  }
  undo() {
    if(this.undoStack.length > 0) 
    {
      let state = this.undoStack.pop()
      this.redoStack.push(state)
      return state
    }
  }
  redo() {
    if(this.redoStack.length > 0) 
    {
      let state = this.redoStack.pop()
      this.undoStack.push(state)
      return state
    }
  }
} 