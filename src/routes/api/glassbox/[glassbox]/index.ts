import mongo from '$lib/mongo'
import { ObjectId } from 'mongodb';
import configuration from '$lib/configuration';

async function ask(params, query: URLSearchParams) {
    try {
        const limit = query.get('limit') ? Number.parseInt(query.get('limit')) ?? 24 : 24; // lowkey means limit definied then use that else 24.

        let additionalQueries = query.has('json') ? JSON.parse(Buffer.from(query.get('json'), 'base64url').toString()) : {};
        let additionalParameters = query.has('json') ? `&json=${query.get('json')}` : '';

        let lastId: string;

        if (additionalQueries[':from']) {
            lastId = additionalQueries[':from'];
            delete additionalQueries[':from']
        }

        if (query.has('last')) {
            lastId = query.get('last')
        }

        if (lastId) {
            additionalQueries._id = {
                // $lt = latest
                // $gt = oldest
                $lt: new ObjectId(lastId)
            }
        }

        let latest = !additionalQueries[':oldest'];

        delete additionalQueries[':oldest']

        const result = (await mongo.getClient()).db(configuration('MONGO_DATABASE')).collection(params.glassbox).find(additionalQueries);
        let cursor = result.limit(limit)

        if (latest) {
            cursor = cursor.sort({ '_id': -1 })
        } else {
            cursor = cursor.sort({ '_id': 1 })
        }

        const data = (await cursor.toArray()).flat();

        try {
            return {
                body: {
                    next: `/api/glassbox/${params.glassbox}/?last=${data[data.length - 1]._id}${additionalParameters}`,
                    data: data
                },
                status: 200
            }
        } catch (__) {
            return {
                body: {
                    next: null,
                    data: data
                },
                status: 200
            }
        }
    } catch (err) {
        console.error(err)
        return {
            body: {
                errors: [
                    err.message
                ]
            }, 
            status: 500
        }
    }
}

/** @type {import('./items').RequestHandler} */
export async function get({ params, url }) {
    const items = await ask(params, url.searchParams);

    return items;
}