export default class History {
  constructor() {
    this.undoStack = []
    this.redoStack = []
  }
  store = (state) => {
    this.undoStack.push(state)
    this.redoStack = []
  }
  undo = _=> {
    if(this.undoStack.length > 0) 
    {
      let state = this.undoStack.pop()
      this.redoStack.push(state)
      return state
    }
  }
  redo = _=> {
    if(this.redoStack.length > 0) 
    {
      let state = this.redoStack.pop()
      this.undoStack.push(state)
      return state
    }
  }
  clear = () => {
    this.undoStack = []
    this.redoStack = []
  }
  getAll = _=> [...this.undoStack,...this.redoStack]
} 