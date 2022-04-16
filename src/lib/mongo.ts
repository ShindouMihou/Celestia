import { MongoClient } from 'mongodb';
import configuration from './configuration';

let _client: MongoClient;

export const client = async () => {
    if (!_client) {
        _client = await new MongoClient(configuration('MONGO_URI'), {
            servername: 'Celestia'
        }).connect();

        return _client;
    }
};

export const celebi = async () => {
    return (await client()).db('celebi');
};