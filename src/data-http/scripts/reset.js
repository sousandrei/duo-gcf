'use strict'

require('dotenv').config()

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

process.on('unhandledRejection', (reason, promise) => {
	console.error(reason, promise)
})

async function main() {
	console.log('start')

	let db = await mongoose
		.connect(process.env.MONGO_URL, { useMongoClient: true })

	console.log('conectou')

	await db.dropDatabase()

	console.log('dropou')

	await mongoose.disconnect()
}

module.exports = main()

