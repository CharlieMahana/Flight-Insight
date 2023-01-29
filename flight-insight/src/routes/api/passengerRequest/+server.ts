import { MONGODB_URI } from '$env/static/private';
import { MongoClient } from 'mongodb';

let mongoClient = new MongoClient(MONGODB_URI);
await mongoClient.connect();
let db = mongoClient.db('inflight_data');
let col = db.collection('passenger_requests');

export async function GET({ after }) {
    if (after == null) {
        let data = await col.find().sort().toArray();
        return new Response(JSON.stringify(data));
    } else {
        let data = await col.find({completed: false, $gt: {_id: after}}).sort().toArray();
        return new Response(JSON.stringify(data));
    }
}