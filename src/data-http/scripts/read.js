'use strict'

require('dotenv').config()

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

require('../Data')
const Data = require('mongoose').model('Data')

process.on('unhandledRejection', (reason, promise) => {
	console.error(reason, promise)
})

async function main() {
	console.log('start')

	await mongoose.connect(process.env.MONGO_URL,
		{ useMongoClient: true, autoIndex: false })

	console.log('conectou')

	let d = await Data.find().limit(1)
	console.log(d)

	await mongoose.disconnect()
}

module.exports = main()

