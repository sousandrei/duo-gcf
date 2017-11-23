'use strict'

require('dotenv').config()

console.log(process.ENV)
process.exit(0)

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

require('./Data')
const Data = require('mongoose').model('Data')

process.on('unhandledRejection', (reason, promise) => {
	console.error(reason, promise)
})


/**
 * Cloud Function.
 *
 * @param {object} event The Cloud Functions event.
 * @param {function} callback The callback function.
 */
exports.data = async (req, res) => {

	//testing
	res.set('Access-Control-Allow-Origin', '*')
	res.set('Access-Control-Allow-Methods', '*')

	try {
		global.DB = await mongoose.connect(process.env.MONGO_URL,
			{ useMongoClient: true })

		switch (req.method) {
			case 'GET':
				await handleGET(req, res)
				break
			case 'POST':
				await handlePOST(req, res)
				break
			case 'LINK':
				await handleLINK(req, res)
				break
			default:
				res.status(409).end()
				break
		}

		await mongoose.disconnect()
	} catch (err) {
		console.error('data', err)
		await mongoose.disconnect()
		return res.status(500).json(err)
	}
}


async function handleGET(req, res) {
	try {
		if (req.query.groupBy)
			return await groupBy(req, res)

		if (req.query.count)
			return await count(req, res)

		if (req.query.last)
			return await last(req, res)

		return res.status(400).end('escolha uma operacao')
	} catch (err) {
		console.error('get', err)
		return res.status(500).json(err)
	}

}

async function handlePOST(req, res) {
	try {
		let item = await new Data(req.body).save()
		return res.status(200).json(item)
	} catch (err) {
		console.error('post', err)
		return res.status(500).json(err)
	}
}

async function handleLINK(req, res) {
	// porra firebase

	res.status(200).end()
}


async function count(req, res) {
	let count = await Data.count()
	return res.status(200).json({ count })
}

async function last(req, res) {
	let last = await Data.findOne().sort({ _id: -1 })
	return res.status(200).json(last)
}

async function groupBy(req, res) {
	let datas = global.DB.collection('datas')
	let result

	switch (req.query.groupBy) {
		case 'day':
			result = await aggregate(datas, [
				{
					$group: {
						_id: {
							month: { $month: '$timestamp' },
							day: { $dayOfMonth: '$timestamp' }
						},
						amps: { $avg: '$amps' },
						volts: { $avg: '$volts' }
					}
				},
				{ $sort: { _id: 1 } }
			])
			break
		case 'month':
			result = await aggregate(datas, [
				{
					$group: {
						_id: {
							month: { $month: '$timestamp' },
						},
						amps: { $avg: '$amps' },
						volts: { $avg: '$volts' }
					}
				},
				{ $sort: { _id: 1 } }
			])
			break
		default:
			return res.status(400).end('filtre por dia ou mes')
	}

	return res.status(200).json(result)
}

function aggregate(datas, exp) {
	return new Promise((resolve, reject) => {
		datas.aggregate(exp, function (err, results) {
			if (err)
				return reject(err)

			return resolve(results)
		})
	})
}