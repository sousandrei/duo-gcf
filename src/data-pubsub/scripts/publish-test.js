const PubSub = require('@google-cloud/pubsub')

process.on('unhandledRejection', (reason, promise) => {
	console.error(reason, promise)
})

const projectId = 'akuntsu-168619'
const topicName = 'new_data'
const pubsub = PubSub({
	projectId,
	credentials: require('./akuntsu-key.json')
})


const topic = pubsub.topic(topicName)
const publisher = topic.publisher()

let data = { amps: 1, volts: 0, timestamp: new Date() }
const dataBuffer = Buffer.from(JSON.stringify(data))

publisher.publish(dataBuffer)
	.then((results) => {
		const messageId = results[0]

		console.log(`Message ${messageId} published.`)

		return messageId
	})
