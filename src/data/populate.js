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

	let i = 0
	while (dates[dates.length - 1].timestamp < moment()) {
		dates.push(fakeData())
		if (dates.length == 100) {
			dates = dates.map(d => new Data(d).save())
			await Promise.all(dates)
			dates = [fakeData()]
		}
	}

	await mongoose.disconnect()
}


async function firebase_cloud_messaging() {
	//firebase

	// databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
	// storageBucket: '<BUCKET>.appspot.com',
	const firebase = require('firebase')

	firebase.initializeApp({
		apiKey: 'AAAAylAQdf8:APA91bFDH6822LlUxWn11vGPtKEZeMf6S9sUqxf9DB76-Bo' +
		'0FjO5q7wSFIRVl7Q8SrgfrWrmqP4Q6qtD_rH3L6LoKz1ya1aUxEeWtSgSIDEw3pAiIt' +
		'm9znXL-PNXFYYULyqEvWbkAzWj',
		authDomain: 'monkey-735a9.firebaseapp.com',
		messagingSenderId: '868926649855',
	})

	console.log(firebase)

}
module.exports = firebase_cloud_messaging()

