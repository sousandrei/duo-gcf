const mongoose = require('mongoose')

let dataSchema = mongoose.Schema({
	amps: Number,
	volts: Number,
	timestamp: Date,
})

module.exports = mongoose.model('Data', dataSchema)
