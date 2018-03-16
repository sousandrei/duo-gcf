'use strict'

require('dotenv').config()

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

require('./Data')
const Data = require('mongoose').model('Data')


process.on('unhandledRejection', (reason, promise) => {
	console.error(reason, promise)
})


exports['data-pubsub'] = async function (event, callback) {

	let data = Buffer.from(event.data.data, 'base64').toString()

	console.info('event', event.data)
	console.info('data', data)

	try {
		data = JSON.parse(data)
	} catch (err) {
		console.error('parse', err)
		return callback()
	}

	try {
		await mongoose.connect(process.env.MONGO_URL,
			{ autoIndex: false, useMongoClient: true })
	} catch (err) {
		console.error('connect', err)
		return callback()
	}

	try {
		data.timestamp = new Date()
		await new Data(data).save()
	} catch (err) {
		console.error('create', err)
	}

	await mongoose.disconnect()
	return callback()
}
