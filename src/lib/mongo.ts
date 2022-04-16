import { MongoClient } from 'mongodb';
import configuration from './configuration';

let _mongoInstance: MongoClient = null;

export default {
    getClient: async () => {
        if (_mongoInstance == null) {
            _mongoInstance = await MongoClient.connect(configuration('MONGO_URI'))
        }

        return _mongoInstance;
    }
}