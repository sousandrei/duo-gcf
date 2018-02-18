'use strict'

require('dotenv').config()

const faker = require('faker')
const moment = require('moment')

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

require('../Data')
const Data = require('mongoose').model('Data')

process.on('unhandledRejection', (reason, promise) => {
	console.error(reason, promise)
})

let date = moment('2018-01-01T00:00:00.000Z')

function fakeData() {
	return {
		amps: faker.random.number({ min: 0, max: 100 }) + Math.random(),
		volts: faker.random.number({ min: 210, max: 230 }) + Math.random(),
		timestamp: date.toISOString()
	}
}

async function main() {
	console.log('start')

	let db = await mongoose
		.connect(process.env.MONGO_URL, { poolSize: 100 })

	console.log('conectou')

	await db.connection.dropDatabase()

	console.log('dropped')

	let datas = [JSON.parse(JSON.stringify(fakeData()))]

	while (datas[datas.length - 1].timestamp < moment().toISOString()) {
		datas.push(fakeData())
		date.add(10, 's')
	}

	console.log('gerou')

	await Data.insertMany(datas)

	console.log('salvou')

	await mongoose.disconnect()
}

module.exports = main()

