<script>
    import { onMount } from 'svelte'
    import mapboxgl from "mapbox-gl";
    import turf from 'turf';
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

        map.on('load', () => {
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
        });
    })
</script>

<svelte:head>
    <link href="https://api.tiles.mapbox.com/mapbox-gl-js/v0.45.0/mapbox-gl.css" rel='stylesheet' />
    <script src="https://api.mapbox.com/mapbox-assembly/v0.23.2/assembly.js"></script>
</svelte:head>

<div>
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
</div>

<style>
    #map {
        height: 500px;
        max-height: 500px;
        max-width: 1000px;
        border-radius: 10px;
        margin: 20px auto;
    }
</style>