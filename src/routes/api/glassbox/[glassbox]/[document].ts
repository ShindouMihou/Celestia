import mongo from '$lib/mongo'
import { ObjectId } from 'mongodb';

/** @type {import('./items').RequestHandler} */
export async function get({ params }) {
    const item = (await (await mongo.getClient()).db('celebi').collection(params.glassbox).findOne({
        _id: new ObjectId(params.document)
    }))
   
    return {
      body: item
    };
}