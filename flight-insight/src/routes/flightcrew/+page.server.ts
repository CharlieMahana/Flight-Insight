import { env } from "$env/dynamic/private";
import type { Actions } from "@sveltejs/kit";
import { MongoClient, ObjectId } from "mongodb";

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
        _id: new ObjectId(_id)
      });
  
      return {
        success: true,
      };
    },
  };