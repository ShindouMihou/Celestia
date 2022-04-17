import mongo from '$lib/mongo'

/** @type {import('./items').RequestHandler} */
export async function get() {
    try {
        const items = await (Promise.all((await (await mongo.getClient()).db('celebi').collections()).map(async collection => {
            return {
                name: collection.collectionName,
                count: await collection.estimatedDocumentCount()
            }
        }).flat()))
       
        return {
            body: items
        };
    } catch (err) {
        console.error(err);
        return {
            body: {
                errors: [
                    err
                ]
            },
            status: 500
        }
    }
}