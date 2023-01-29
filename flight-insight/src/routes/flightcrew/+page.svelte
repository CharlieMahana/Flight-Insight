<script lang="ts">
    import { onMount } from 'svelte'
    import mapboxgl from "mapbox-gl";
    import turf from 'turf';
    import { time_ranges_to_array } from 'svelte/internal';
    import TurbulenceChart from "$lib/components/TurbulenceChart.svelte";
    import HumidityChart from "$lib/components/HumidityChart.svelte";
    import TemperatureChart from "$lib/components/TemperatureChart.svelte";
    import A230Map from '$lib/components/A230Map.svelte';

    mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmxpZW1haGFuYSIsImEiOiJja3FicmNhOWQwZDQwMnVvZW5pd3BnNGc4In0._TBwk5GaE5qqih2pilaLNw' // default public access token

    const departingCoordinates = [-97.0403, 32.8998];
    const arrivingCoordinates = [-71.0096, 42.3656];
    onMount(() => {
        const map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v12",
            center: [-98, 38],
            zoom: 3.3,
            attributionControl: false,
        }).addControl(new mapboxgl.AttributionControl({
            compact: true,
        }));     

        map.on('load', async () => {
            map.addSource('line', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'LineString',
                                'coordinates': [departingCoordinates, arrivingCoordinates]
                            }
                        },
                    ]
                }
            });

            map.addLayer({
                'id': 'line-animation',
                'type': 'line',
                'source': 'line',
                'layout': {
                'line-cap': 'round',
                'line-join': 'round'
                },
                'paint': {
                'line-color': '#000000',
                'line-width': 2,
                'line-opacity': 0.8
                }
            });

            // create departing airport pin
            const departure = document.createElement('div');
            departure.className = 'marker';
            new mapboxgl.Marker(departure).setLngLat(departingCoordinates).addTo(map);

            // create arrival airport pin
            const arrival = document.createElement('div');
            arrival.className = 'marker';
            new mapboxgl.Marker(arrival).setLngLat(arrivingCoordinates).addTo(map);

            // add weather layer
            const timeSlices = await fetch(
                "https://api.weather.com/v3/TileServer/series/productSet/PPAcore?apiKey=2ec2232d72f1484282232d72f198421d"
            );
            const weatherData = await timeSlices.json()
            const time = weatherData.seriesInfo.radar.series[0].ts;
            map.addSource('twcRadar', {
                type: 'raster',
                tiles: [
                    'https://api.weather.com/v3/TileServer/tile/radar?ts=' + time + '&xyz={x}:{y}:{z}&apiKey=2ec2232d72f1484282232d72f198421d'
                ],
                tileSize: 256,
            });
            map.addLayer(
                {
                    id: 'radar',
                    type: 'raster',
                    source: 'twcRadar',
                    paint: {
                        'raster-opacity': 0.7,
                    },
                },
            );
        });
    })

    function setSeat(evt:MouseEvent){
        const seatNum = evt.target?.value;
        const seat = document.getElementById(seatNum);
        seat?.setAttribute("fill", "#ff0000");
        seat?.setAttribute("class", "animate-pulse");
    }

    function unsetSeat(seatNumber:string){
        const seat = document.getElementById(seatNumber);
        seat?.setAttribute("fill", "#D9D9D9");
        seat?.setAttribute("class", "");
    }
</script>

<svelte:head>
    <link href="https://api.tiles.mapbox.com/mapbox-gl-js/v0.45.0/mapbox-gl.css" rel='stylesheet' />
    <script src="https://api.mapbox.com/mapbox-assembly/v0.23.2/assembly.js"></script>
</svelte:head>

<div class="verticalContainer">
    <div>
        <table>
            <!-- head -->
            <thead>
                <tr>
                <th></th>
                <th>Seat</th>
                <th>Problem</th>
                <th>Toggle Seat Signal</th>
                <th>Remove Issue</th>
                </tr>
                <tr>
                </tr>
            </thead>
        </table>
    </div>
    <div id="map"></div>
    <style>
        .marker {
        background-image: url('https://www.iconpacks.net/icons/2/free-airport-location-icon-2959-thumb.png');
        background-size: cover;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        top: -20px;
        }
    </style>
    <div class="horizontalContainer">
        <TurbulenceChart></TurbulenceChart>
        <HumidityChart></HumidityChart>
        <TemperatureChart></TemperatureChart>
    </div>
    <div>
        <A230Map></A230Map>
    </div>
    <button on:click="{setSeat}" value="C17">Seat</button>
</div>

<style>
    #map {
        height: 500px;
        max-height: 400px;
        width: 1000px;
        border-radius: 10px;
        margin: 20px auto;
    }

    div {
        display: flex;
        width: 1000px;
        margin: auto;
    }

    .verticalContainer {
        display: flex;
        flex-direction: column;
    }
    .horizontalContainer {
        display: flex;
        flex-direction: horizontal;
    }
</style>