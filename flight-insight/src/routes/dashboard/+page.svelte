<script lang="ts">
    import { onMount } from "svelte";
    import mapboxgl from "mapbox-gl";
    import turf from "turf";
    import { time_ranges_to_array } from "svelte/internal";
    import AmericanIcon from "$lib/components/AmericanIcon.svelte";
    import A230Map from "$lib/components/A230Map.svelte";
    import type { PageData } from "../$types";
    mapboxgl.accessToken =
        "pk.eyJ1IjoiY2hhcmxpZW1haGFuYSIsImEiOiJja3FicmNhOWQwZDQwMnVvZW5pd3BnNGc4In0._TBwk5GaE5qqih2pilaLNw"; // default public access token

    const departingCoordinates = [-97.0403, 32.8998];
    const arrivingCoordinates = [-71.0096, 42.3656];

    export let data: PageData;

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
                                    departingCoordinates,
                                    arrivingCoordinates,
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
                .setLngLat(departingCoordinates)
                .addTo(map);

            // create arrival airport pin
            const arrival = document.createElement("div");
            arrival.className = "marker";
            new mapboxgl.Marker(arrival)
                .setLngLat(arrivingCoordinates)
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
<div>
    <div class="w-full bg-primary h-16 flex ">
        <div class="flex flex-row align-middle text-center ">
            <div class="w-12 h-12 mr-4 m-auto ml-4">
                <AmericanIcon />
            </div>
            <p class="align-middle m-auto text-base-100">Flight Insight</p>
        </div>
        <div />
    </div>
    <div>
        <div>
            <div id="map" class="w-3/4 h-64 md:max-h-[500] " />
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
            <div id="map" class="w-3/4 h-64 flex flex-col md:flex-row">
                <div class="card bg-base-200 w-full h-96 m-2 p-4">
                    <p class="text-xl">Departure Weather</p>
                    <p>{data.originWeather.temperature}&deg;</p>
                    {#if data.originWeather.precipitation > 0}
                        <img src="/weather/rainy-2.svg" alt="rainy" />
                    {:else if data.originWeather.cloudcover > 50}
                        <img src="/weather/cloudy-day-2.svg" alt="cloudy day" />
                    {:else}
                        <img src="/weather/day.svg" alt="clear" />
                    {/if}
                </div>
                <div class="card bg-base-200 w-full h-96 m-2 p-4">
                    <p class="text-xl">Arrival Weather</p>
                    <p>{data.destinationWeather.temperature}&deg;</p>
                </div>
            </div>
            <div class="w-3/4 m-auto mb-10">
                <A230Map></A230Map>
            </div>
            <div class="w-3/4 m-auto mb-10">
                <A230Map></A230Map>
            </div>
        </div>

        <style>
            #map {
                height: 500px;
                max-height: 500px;
                border-radius: 10px;
                margin: 20px auto;
            }
        </style>
    </div>
</div>
