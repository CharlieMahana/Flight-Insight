import { env } from "$env/dynamic/private";
import { error, fail } from "@sveltejs/kit";
import { MongoClient } from "mongodb";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, fetch, locals }) => {
  const recordLocator = url.searchParams.get("recordLocator")?.toUpperCase();
  // if (!recordLocator) return error(404, "Record not found");

  // load flight data from the database
  const client = await new MongoClient(env.MONGODB_URI, {}).connect();
  const db = client.db("weather");
  // @ts-ignore
  const flight = await db
    .collection("flights")
    .findOne({ recordLocator }, { projection: { _id: 0 } });
  if (!flight) throw "FLight not found";

  const origin = flight?.origin.location;
  const destination = flight?.destination.location;

  // get weather data from meteo api
  const originWeather = fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${origin.latitude}&longitude=${origin.longitude}&hourly=temperature_2m,precipitation,cloudcover`
  )
    .then((res) => res.json())
    .then((res) => {
      const departureHour = new Date(flight.departureTime).getHours();
      const index = res.hourly.time.findIndex(
        (time: string) => new Date(time).getHours() === departureHour
      );
      return {
        temperature: res.hourly.temperature_2m[index] * 1.8 + 32,
        precipitation: res.hourly.precipitation[index] / 25.4,
        cloudcover: res.hourly.cloudcover[index] / 100,
      };
    });
  const destinationWeather = fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${destination.latitude}&longitude=${destination.longitude}&hourly=temperature_2m,precipitation,cloudcover`
  )
    .then((res) => res.json())
    .then((res) => {
      const arrivalHour = new Date(flight.arrivalTime).getHours();
      const index = res.hourly.time.findIndex(
        (time: string) => new Date(time).getHours() === arrivalHour
      );
      return {
        temperature: res.hourly.temperature_2m[index] * 1.8 + 32,
        precipitation: res.hourly.precipitation[index] / 25.4,
        cloudcover: res.hourly.cloudcover[index] / 100,
      };
    });

  return {
    flight,
    originWeather,
    destinationWeather,
  };
};

export const actions: Actions = {
  // default action sends report to the flight attendants
  default: async ({ request }) => {
    // get report from user
    const form = await request.formData();
    const seat = form.get("seat");
    const complaint = form.get("complaint");
    if (!seat || !complaint)
      return fail(400, { seat, complaint, missing: true });

    const client = await new MongoClient(env.MONGODB_URI, {}).connect();
    const db = client.db("inflight_data");
    const passenger_requests = db.collection("passenger_requests");
    await passenger_requests.insertOne({
      seat,
      complaint,
      timestamp: new Date(),
    });

    return {
      success: true,
    };
  },
};
