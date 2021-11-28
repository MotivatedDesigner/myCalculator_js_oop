export default class Memory {
	constructor() {
		this.records = []
	}

	push = (value) => this.records.push(value)
	
	pop = () => this.records.pop()

	plus = (value, index) => this.records[ index ?? this.records.length-1 ] += value

	minus = (value, index) => this.records[ index ?? this.records.length-1 ] -= value

	clear = (index) => index ? this.records.splice(index, index+1) : this.records.pop()
}