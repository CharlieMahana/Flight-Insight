import { env } from '$env/dynamic/private';
import { MongoClient, type MongoClientOptions } from 'mongodb';
import { dev } from '$app/environment';

if (!env.MONGODB_URI) {
	throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const options = {} satisfies MongoClientOptions;

let client;
let clientPromise: Promise<MongoClient>;

if (dev) {
	// In development mode, use a global variable so that the value
	// is preserved across module reloads caused by HMR (Hot Module Replacement).
	// @ts-ignore
	if (!global._mongoClientPromise) {
		client = new MongoClient(env.MONGODB_URI, options);
		// @ts-ignore
		global._mongoClientPromise = client.connect();
	}
	// @ts-ignore
	clientPromise = global._mongoClientPromise;
} else {
	// In production mode, it's best to not use a global variable.
	client = new MongoClient(env.MONGODB_URI, options);
	clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;