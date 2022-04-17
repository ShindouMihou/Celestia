const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URI;

/**
 * @type MongoClient
 */
var _mongoInstance;

module.exports = {
    connect: (callback) => {
        MongoClient.connect(uri, function (err, client) {
            _mongoInstance = client;
            return callback(err);
        })
    },
    getClient: () => {
        return _mongoInstance;
    }
};