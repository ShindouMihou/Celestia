import mongo from '$lib/mongo'
import { ObjectId } from 'mongodb';
import configuration from '$lib/configuration';

/** @type {import('./items').RequestHandler} */
export async function get({ params }) {
    const item = (await (await mongo.getClient()).db(configuration('MONGO_DATABASE')).collection(params.glassbox).findOne({
        _id: new ObjectId(params.document)
    }))
   
    return {
      body: item
    };
}