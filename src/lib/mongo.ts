import { MongoClient } from 'mongodb';
import configuration from './configuration';

let _mongoInstance: MongoClient = null;

export default {
    getClient: async () => {
        try {
            if (_mongoInstance == null) {
                _mongoInstance = await MongoClient.connect(configuration('MONGO_URI'))
            }
    
            return _mongoInstance;
        } catch (err) {
            console.error('Please check your connection with your MongoDB instance.')
        }
    }
}