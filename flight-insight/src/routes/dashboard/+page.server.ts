import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";
import { MongoClient } from "mongodb";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, fetch, locals }) => {
  const recordLocator = url.searchParams.get("recordLocator");
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
  const originWeather = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${origin.latitude}&longitude=${origin.longitude}&hourly=temperature_2m,precipitation,cloudcover`
  ).then((res) => res.json());
  // .then((res) => {
  //   const now = new Date();
  //   const min = res.hourly.time
  //     .map((hour: string) => new Date(hour).getTime() - now.getTime())
  //     .filter((diff: number) => diff > 0)
  //     .min();
  //   const index = res.hourly.time.indexOf(now.getTime() + min);
  //   return {
  //     temperature: res.hourly.temperature_2m[index],
  //     precipitation: res.hourly.precipitation[index],
  //     cloudcover: res.hourly.cloudcover[index],
  //   };
  // });
  const destinationWeather = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${destination.latitude}&longitude=${destination.longitude}&hourly=temperature_2m,precipitation,cloudcover`
  ).then((res) => res.json());
  // .then((res: any) => {
  //   const now = new Date();
  //   const min = res.hourly.time.map(
  //     (hour: string | null) => new Date(hour || now).getTime() - now.getTime()
  //   );
  //   .filter((diff: number) => diff > 0)
  // .min();
  // const index = res.hourly.time.indexOf(now.getTime() + min);
  // return {
  //   temperature: res.hourly.temperature_2m[index],
  //   precipitation: res.hourly.precipitation[index],
  //   cloudcover: res.hourly.cloudcover[index],
  // };
  // return min;
  // });

  return {
    flight,
    originWeather,
    destinationWeather,
  };
};
