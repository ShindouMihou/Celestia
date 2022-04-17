require('dotenv').config();
const mongo = require('./lib/mongo');
const processor = require('./lib/processor')
const redis = require('redis');

/**
 * Initializes the consumer to start processing the requests.
 * This performs the init startup checks such as lookups for the environment variables 
 * and connecting to the clients necessary.
 */
async function init() {
    console.log('Attempting to connect to MongoDB...')
    if (!(process.env.MONGO_URI && process.env.REDIS_URI && process.env.MONGO_DATABASE && process.env.REDIS_CHANNEL)) {
        console.error('Not all the configuration properties are present, please double-check your .env file or environment variables.')
        return;
    }

    mongo.connect(async (err) => {
        if (err) {
            console.error("An error was received while trying to connect to MongoDB.", err)
            return;
        }

        try {
            console.log('Attempting to connect to Redis...')
            await start();
        } catch (err) {
            console.error("An error was received while trying to connect to Redis.", err);
        }
    });
}

/**
 * Starts the Redis consumer which will soon start processing every single request that 
 * is being sent from the channel by a publisher.
 */
async function start() {
    const consumer = redis.createClient({
        url: process.env.REDIS_URI
    })

    await consumer.connect()
    await consumer.subscribe(process.env.REDIS_CHANNEL, (message, channel) => {
        processor.process(message, mongo.getClient()).then(result => {
            if (process.env.LOG_ACCEPTED === 'true') {
                console.log(`\nINSERT ${message} was received by processor with ${JSON.stringify(result)}`)
            }
        }).catch(err => {
            console.error(`\nINSERT ${message} was received by processor with error.`, err)
        });
    });

    console.log('------~ Celebi-Celestia: Redis ~--------')
    console.log('Channel: ' + process.env.REDIS_CHANNEL)
    console.log('Logging: ' + (process.env.LOG_ACCEPTED === 'true' ? "All" : "Errors"))
    console.log('---------------------------------')
}

init();