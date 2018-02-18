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

	await mongoose.connect(process.env.MONGO_URL)

	console.log('conectou')

	let data = await Data.find()
		.limit(1)
		.sort('-timestamp')

	console.log('first', data)

	const day = new Date().getDate()
	const month = new Date().getMonth()
	const year = new Date().getFullYear()

	console.log(day, month, year, new Date().getDay())

	let date


	date = new Date(year, month, day - new Date().getDay())

	let dataWeek = await Data
		.aggregate()
		.match({ timestamp: { $gt: date } })
		.group({
			_id: {
				year: { $year: '$timestamp' },
				month: { $month: '$timestamp' },
				day: { $dayOfMonth: '$timestamp' }
			},
			amps: { $avg: '$amps' },
			volts: { $avg: '$volts' }
		})
		.sort('_id')
		.exec()


	console.log('semana', date)
	console.log(dataWeek)



	date = new Date(2018, 0, 1)

	let dataMonths = await Data
		.aggregate()
		.match({ timestamp: { $gt: date } })
		.group({
			_id: {
				year: { $year: '$timestamp' },
				month: { $month: '$timestamp' }
			},
			amps: { $avg: '$amps' },
			volts: { $avg: '$volts' }
		})
		.sort('_id')
		.exec()


	console.log('meses', date)
	console.log(dataMonths)



	date = new Date(year, month, day)

	let dataDay = await Data
		.aggregate()
		.match({ timestamp: { $gt: date } })
		.group({
			_id: {
				year: { $year: '$timestamp' },
				month: { $month: '$timestamp' },
				day: { $dayOfMonth: '$timestamp' },
				hour: { $hour: '$timestamp' }
			},
			amps: { $avg: '$amps' },
			volts: { $avg: '$volts' }
		})
		.sort('_id')
		.exec()


	console.log('hoje', date)
	console.log(dataDay)

	await mongoose.disconnect()
}

module.exports = main()

