const { data } = require("autoprefixer");
const { MongoClient } = require("mongodb");

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

const requirements = ['_callback', '_event', '_glassbox']

module.exports = {
    /**
     * Processes the request and sends the message onto the configured MongoDB
     * instance running.
     * 
     * @param {string} message The message received from the request.
     * @param {MongoClient} client The MongoClient to use when connecting.
     */
    process: async (message, client) => {
        try {
            const request = JSON.parse(message);

            let errors = [];
            
            requirements.forEach(requirement => {
                if (isBlank(request[requirement])) {
                    errors.push(`You are missing the required ${requirement} field.`)
                }
            });
            if (errors.length > 0) {
                throw {
                    errors: errors,
                    callback: request._callback
                }
            }

            const glassbox = request._glassbox;
            delete request._glassbox;
            delete request._callback;
            request._date = new Date();

            return client.db(process.env.MONGO_DATABASE).collection(glassbox).insertOne(request);
        } catch (err) {
            console.error(err);
            throw {
                errors: [
                    err
                ],
                callback: null
            }
        }
    }
}