export default class Memory {
	constructor() {
		this.records = []
	}
	store = (value) => this.records.push(value)
	plus = (value, index) => {
		let index = index ?? this.records.length-1
		this.records[index] += value
	}
	minus = (value, index) => {
		let index = index ?? this.records.length-1
		this.records[index] -= value
	}
	clear = (index) => {
		if(index) this.records.splice(index, index+1)
		else this.records.pop()
	}
}