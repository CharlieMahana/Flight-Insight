import { MONGODB_URI } from '$env/static/private';
import { MongoClient } from 'mongodb';

let mongoClient = new MongoClient(MONGODB_URI);
await mongoClient.connect();
let db = mongoClient.db('inflight_data');
let col = db.collection('environment_data');

export async function GET({}) {
    let data = await col.find().sort({_id:-1}).limit(1).toArray();
    data = data[0];
    return new Response(data.humidity);
}