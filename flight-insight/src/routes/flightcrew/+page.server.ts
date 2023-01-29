import { env } from "$env/dynamic/private";
import { redirect, type Actions } from "@sveltejs/kit";
import { MongoClient, ObjectId } from "mongodb";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
    const { session } = await parent();
    if (!session?.user) throw redirect(303, "/auth/signin");
    return {};
};

export const actions: Actions = {
    // default action sends report to the flight attendants
    default: async ({ request }) => {
        // get report from user
        const form = await request.formData();
        const _id = form.get("_id")! as string;

        const client = await new MongoClient(env.MONGODB_URI, {}).connect();
        const db = client.db("inflight_data");
        const passenger_requests = db.collection("passenger_requests");
        await passenger_requests.deleteOne({
            _id: new ObjectId(_id),
        });

        return {
            success: true,
        };
    },
};
