import { env } from "$env/dynamic/private";
import { MongoClient, type MongoClientOptions } from "mongodb";
import { dev } from "$app/environment";

if (!env.MONGODB_URI) {
	throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const options = {} satisfies MongoClientOptions;

let client;
let clientPromise: Promise<MongoClient>;

client = new MongoClient(env.MONGODB_URI, options);
clientPromise = client.connect();

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
