'use strict'

require('dotenv').config()

const faker = require('faker')
const moment = require('moment')

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

require('./Data')
const Data = require('mongoose').model('Data')

process.on('unhandledRejection', (reason, promise) => {
	console.error(reason, promise)
})

let date = moment('2017-11-01T00:00:00.000Z')

function fakeData() {
	return {
		amps: faker.random.number({ min: 0, max: 100 }),
		volts: faker.random.number({ min: 210, max: 230 }),
		timestamp: date.add(10, 's')
	}
}

async function main() {
	console.log('start')

	let db = await mongoose
		.connect(process.env.MONGO_URL, { useMongoClient: true })

	console.log('conectou')

	await db.dropDatabase()

	let dates = [fakeData()]

	while (dates[dates.length - 1].timestamp < moment()) {
		dates.push(fakeData())
		if (dates.length == 100) {
			dates = dates.map(d => new Data(d).save())
			await Promise.all(dates)
			dates = [fakeData()]
		}
	}

	console.log('populou')

	await mongoose.disconnect()
}

module.exports = main()

