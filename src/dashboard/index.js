'use strict'

require('dotenv').config()

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

require('./Data')
const Data = require('mongoose').model('Data')

process.on('unhandledRejection', (reason, promise) => {
	console.error(reason, promise)
})

const day = new Date().getDate()
const month = new Date().getMonth()
const year = new Date().getFullYear()
const weekInit = day - new Date().getDay()

exports['dashboard'] = async (req, res) => {

	//testing
	res.set('Access-Control-Allow-Origin', '*')
	res.set('Access-Control-Allow-Methods', '*')

	try {
		global.DB = await mongoose.connect(process.env.MONGO_URL,
			{ autoIndex: false })

		switch (req.method) {
			case 'GET':
				await handleGET(req, res)
				break
			default:
				res.status(409).end()
				break
		}

		await mongoose.disconnect()
	} catch (err) {
		console.error('data', err.toString())
		// await mongoose.disconnect()
		return res.status(500).json(err)
	}
}


async function handleGET(req, res) {
	try {
		const [
			instant,
			week,
			month,
			last
		] =
			await Promise.all(
				[
					lastDay(),
					lastWeek(),
					lastMonths(),
					lastData()
				])

		return res.json({
			instant,
			week,
			month,
			last
		})

	} catch (err) {
		console.error('get', err.toString())
		return res.status(500).json(err)
	}

}


function lastData() {
	return Data
		.findOne()
		.sort('-_id')
		.exec()
}

function lastDay() {
	const date = new Date(year, month, day)

	const match = { timestamp: { $gt: date } }
	const group = {
		_id: {
			year: { $year: '$timestamp' },
			month: { $month: '$timestamp' },
			day: { $dayOfMonth: '$timestamp' },
			hour: { $hour: '$timestamp' }
		},
		amps: { $avg: '$amps' },
		volts: { $avg: '$volts' }
	}

	return aggregate(match, group)
}

function lastWeek() {
	const date = new Date(year, month, day - weekInit)

	const match = { timestamp: { $gt: date } }
	const group = {
		_id: {
			year: { $year: '$timestamp' },
			month: { $month: '$timestamp' },
			day: { $dayOfMonth: '$timestamp' }
		},
		amps: { $avg: '$amps' },
		volts: { $avg: '$volts' }
	}

	return aggregate(match, group)
}

function lastMonths() {
	let date

	if (month <= 5)
		date = new Date(year, 0, 1)
	else
		date = new Date(year, month - 6, 1)

	const match = { timestamp: { $gt: date } }
	const group = {
		_id: {
			year: { $year: '$timestamp' },
			month: { $month: '$timestamp' }
		},
		amps: { $avg: '$amps' },
		volts: { $avg: '$volts' }
	}

	return aggregate(match, group)
}


function aggregate(match, group) {
	return Data
		.aggregate()
		.match(match)
		.group(group)
		.sort('_id')
		.exec()
}
