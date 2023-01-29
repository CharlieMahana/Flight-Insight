import type { Handle } from "@sveltejs/kit";
// import clientPromise from "$lib/server/db";
import init from "$lib/server/db/init";
import { SvelteKitAuth } from "@auth/sveltekit";
import { sequence } from "@sveltejs/kit/hooks";
import { dev } from "$app/environment";
import CredentialsProvider from "@auth/core/providers/credentials";

const auth = SvelteKitAuth({
    // TODO: fill in OAuth providers (GitHub, Google, Auth0, etc.)
    providers: [
        CredentialsProvider({
            name: "Development Account",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, _req) {
                // Add logic here to look up the user from the credentials supplied
                const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };

                if (
                    credentials?.username === "jsmith" &&
                    credentials?.password === "password"
                ) {
                    // Any object returned will be saved in `user` property of the JWT
                    return user;
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null;
                }
            },
        }),
    ],
});

// initialize the database once when the server starts
init();

const db: Handle = async ({ event, resolve }) => {
    // // inject mongo database as db
    // const client = await clientPromise;
    // const db = client.db();
    // // @ts-ignore
    // event.locals.db = db;
    //
    const response = await resolve(event);
    return response;
};

export const handle = sequence(auth, db);
