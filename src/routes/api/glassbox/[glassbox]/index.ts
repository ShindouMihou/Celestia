import mongo from '$lib/mongo'
import { ObjectId } from 'mongodb';
import configuration from '$lib/configuration';

async function ask(params, query: URLSearchParams) {
    const limit = query.get('limit') ? Number.parseInt(query.get('limit')) ?? 24 : 24; // lowkey means limit definied then use that else 24.

    let additionalQueries = query.has('json') ? JSON.parse(Buffer.from(query.get('json'), 'base64url').toString()) : {};
    let additionalParameters = query.has('json') ? `&json=${query.get('json')}` : '';

    if (query.has('last')) {
        additionalQueries._id = {
            // $lt = latest
            // $gt = oldest
            $lt: new ObjectId(query.get('last'))
        }
    }

    const result = (await mongo.getClient()).db(configuration('MONGO_DATABASE')).collection(params.glassbox).find(additionalQueries);
    const cursor = result.limit(limit).sort({ '_id': -1 })

    const data = (await cursor.toArray()).flat();

    try {
        return {
            next: `/api/${params.glassbox}/?last=${data[data.length - 1]._id}${additionalParameters}`,
            data: data
        }
    } catch (__) {
        return {
            next: null,
            data: data
        }
    }
}

/** @type {import('./items').RequestHandler} */
export async function get({ params, url }) {
    const items = await ask(params, url.searchParams);
   
    return {
      body: items
    };
}