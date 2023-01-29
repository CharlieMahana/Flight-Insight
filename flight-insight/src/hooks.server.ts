import type { Handle } from "@sveltejs/kit";
// import clientPromise from "$lib/server/db";
import init from "$lib/server/db/init";
import { SvelteKitAuth } from "@auth/sveltekit";
import { sequence } from "@sveltejs/kit/hooks";
import CredentialsProvider from "@auth/core/providers/credentials";

const auth = SvelteKitAuth({
    // TODO: fill in OAuth providers (GitHub, Google, Auth0, etc.)
    providers: [
        CredentialsProvider({
            name: "Flight Crew Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, _req) {
                // Add logic here to look up the user from the credentials supplied
                const users = [
                    { id: 1, name: "charlie", email: "charlie@nebula.com" },
                    { id: 2, name: "amrit", email: "amrit@nebula.com" },
                    { id: 3, name: "adam", email: "adam@nebula.com" },
                    { id: 4, name: "eric", email: "eric@nebula.com" },
                ];

                if (
                    users.map((user) => user.name).includes(credentials?.username) &&
                    credentials?.password === "password"
                ) {
                    // Any object returned will be saved in `user` property of the JWT
                    return users.find((user) => user.name === credentials?.username);
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
