const mongoose = require('mongoose')

let dataSchema = mongoose.Schema({
	irms: Number,
	tensao: Number,
	potencia: Number,
	timestamp: Date,
})

module.exports = mongoose.model('Data', dataSchema)
