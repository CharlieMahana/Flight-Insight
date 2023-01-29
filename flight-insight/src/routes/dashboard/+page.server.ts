import { fail } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ url, fetch, locals }) => {
  const recordLocater = url.searchParams.get("recordLocater");
  if (!recordLocater) return fail(404);

  // load flight data from the database
  const db = locals.db;
  // @ts-ignore
  const flight = await db.flights.find({ recordLocater });

  const origin = flight.origin.location;
  const destination = flight.destination.location;

  // get weather data from meteo api
  const originWeather = fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${origin.latitude}&longitude=${origin.longitude}&hourly=temperature_2m,precipitation,cloudcover`
  )
    .then((res) => res.json())
    .then((res) => {
      const now = new Date();
      const min = res.hourly.time
        .map((hour: string) => new Date(hour).getTime() - now.getTime())
        .filter((diff: number) => diff > 0)
        .min();
      const index = res.hourly.time.indexOf(now.getTime() + min);
      return {
        temperature: res.hourly.temperature_2m[index],
        precipitation: res.hourly.precipitation[index],
        cloudcover: res.hourly.cloudcover[index],
      };
    });
  const destinationWeather = fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${destination.latitude}&longitude=${destination.longitude}&hourly=temperature_2m,precipitation,cloudcover`
  )
    .then((res) => res.json())
    .then((res) => {
      const now = new Date();
      const min = res.hourly.time
        .map((hour: string) => new Date(hour).getTime() - now.getTime())
        .filter((diff: number) => diff > 0)
        .min();
      const index = res.hourly.time.indexOf(now.getTime() + min);
      return {
        temperature: res.hourly.temperature_2m[index],
        precipitation: res.hourly.precipitation[index],
        cloudcover: res.hourly.cloudcover[index],
      };
    });

  return {
    flight,
    originWeather,
    destinationWeather,
  };
};
