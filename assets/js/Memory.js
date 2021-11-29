export default class Memory {
	constructor() {
		this.records = []
	}

	push = (value) => this.records.push( parseFloat(value) )
	
	peek = () => this.records[this.records.length-1]

	plus = (value, index) => this.records[ index ?? this.records.length-1 ] += parseFloat(value)

	minus = (value, index) => this.records[ index ?? this.records.length-1 ] -= parseFloat(value)

	clear = (index) => index ? this.records.splice(index, index+1) : this.records.pop()
}
