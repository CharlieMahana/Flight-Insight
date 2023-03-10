<script lang="ts">
    import { onMount } from "svelte";
    import mapboxgl from "mapbox-gl";
    import turf from "turf";
    import { time_ranges_to_array } from "svelte/internal";
    import AmericanIcon from "$lib/components/AmericanIcon.svelte";
    import A230Map from "$lib/components/A230Map.svelte";
    import type { PageData } from "../$types";
    import ReportForm from "$lib/components/ReportForm.svelte";
    import { page } from "$app/stores";
    import WeatherWidget from "$lib/components/WeatherWidget.svelte";
    mapboxgl.accessToken =
        "pk.eyJ1IjoiY2hhcmxpZW1haGFuYSIsImEiOiJja3FicmNhOWQwZDQwMnVvZW5pd3BnNGc4In0._TBwk5GaE5qqih2pilaLNw"; // default public access token

    export let data: PageData;

    export let form: FormData;

    onMount(() => {
        const map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v12",
            center: [-98, 38],
            zoom: 3.3,
            attributionControl: false,
        }).addControl(
            new mapboxgl.AttributionControl({
                compact: true,
            })
        );

        map.on("load", async () => {
            map.addSource("line", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            geometry: {
                                type: "LineString",
                                coordinates: [
                                    [data.flight.origin.location.longitude, data.flight.origin.location.latitude],
                                    [data.flight.destination.location.longitude, data.flight.destination.location.latitude],
                                ],
                            },
                        },
                    ],
                },
            });

            map.addLayer({
                id: "line-animation",
                type: "line",
                source: "line",
                layout: {
                    "line-cap": "round",
                    "line-join": "round",
                },
                paint: {
                    "line-color": "#000000",
                    "line-width": 2,
                    "line-opacity": 0.8,
                },
            });

            // create departing airport pin
            const departure = document.createElement("div");
            departure.className = "marker";
            new mapboxgl.Marker(departure)
                .setLngLat([data.flight.origin.location.longitude, data.flight.origin.location.latitude])
                .addTo(map);

            // create arrival airport pin
            const arrival = document.createElement("div");
            arrival.className = "marker";
            new mapboxgl.Marker(arrival)
                .setLngLat([data.flight.destination.location.longitude, data.flight.destination.location.latitude])
                .addTo(map);

            // add weather layer
            const timeSlices = await fetch(
                "https://api.weather.com/v3/TileServer/series/productSet/PPAcore?apiKey=2ec2232d72f1484282232d72f198421d"
            );
            const weatherData = await timeSlices.json();
            const time = weatherData.seriesInfo.radar.series[0].ts;
            map.addSource("twcRadar", {
                type: "raster",
                tiles: [
                    "https://api.weather.com/v3/TileServer/tile/radar?ts=" +
                        time +
                        "&xyz={x}:{y}:{z}&apiKey=2ec2232d72f1484282232d72f198421d",
                ],
                tileSize: 256,
            });
            map.addLayer({
                id: "radar",
                type: "raster",
                source: "twcRadar",
                paint: {
                    "raster-opacity": 0.7,
                },
            });
        });

        window.setInterval(async () => {
            let info = await fetch("/api/turbulence");
            info = await info.json();
            data.info = parseFloat(info / 10);
        }, 1000);
    });

    //   const now = new Date();
    //   const destinationWeather = data.destinationWeather.hourly.time.map(
    //   (hour: string | null) => new Date(hour || now).getTime() - now.getTime()) .filter((diff: number) => diff > 0)
    // .min();
    // const index = res.hourly.time.indexOf(now.getTime() + min);
    // return {
    //   temperature: res.hourly.temperature_2m[index],
    //   precipitation: res.hourly.precipitation[index],
    //   cloudcover: res.hourly.cloudcover[index],
    // };
    // return min;
    // );
</script>

<svelte:head>
    <link
        href="https://api.tiles.mapbox.com/mapbox-gl-js/v0.45.0/mapbox-gl.css"
        rel="stylesheet"
    />
    <script
        src="https://api.mapbox.com/mapbox-assembly/v0.23.2/assembly.js"
    ></script>
</svelte:head>
<div class="min-h-screen">
    <div class="w-full bg-primary h-16 flex ">
        <div class="flex flex-row align-middle text-center ">
            <div class="w-12 h-12 mr-4 m-auto ml-4">
                <AmericanIcon />
            </div>
            <p class="align-middle m-auto text-base-100">Flight Insight</p>
        </div>
        <div />
    </div>
    {#if data.info > 0.6}
        <div class="alert alert-error mt-2">
            <p>
                Turbulance Detected! Please remain in your seat and fasten your
                seatbelt!
            </p>
        </div>
    {/if}

    <div
        class="flex flex-row-reverse flex-wrap justify-evenly items-center h-full p-6"
    >
        <div class="w-full max-w-[1024px]">
            <div
                id="map"
                class="w-full h-64 md:min-h-[80vh] md:h-full  rounded-md place-self-center"
            />
            <style>
                .marker {
                    background-image: url("https://www.iconpacks.net/icons/2/free-airport-location-icon-2959-thumb.png");
                    background-size: cover;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    cursor: pointer;
                    top: -20px;
                }
            </style>
        </div>

        <div
            class="flex flex-row flex-wrap justify-evenly items-center gap-3 p-6"
        >
            <WeatherWidget
                weather={data.originWeather}
                location={data.flight.origin.city}
            />
            <WeatherWidget
                weather={data.destinationWeather}
                location={data.flight.destination.city}
            />
        </div>
    </div>
</div>

<label
    for="report-form-modal"
    class="btn fixed bottom-1 right-1 md:bottom-4 md:right-4"
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
    >
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002"
        />
    </svg>
</label>

<input type="checkbox" id="report-form-modal" class="modal-toggle" />
<label
    for="report-form-modal"
    class="modal modal-bottom sm:modal-middle cursor-pointer"
>
    <label class="modal-box relative" for="">
        <ReportForm
            seat={form?.seat}
            complaint={form?.complaint}
            flightnum={form?.flightnum}
            success={form?.success}
            missing={form?.missing}
        />
    </label>
</label>
