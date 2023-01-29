<script lang='ts'>
    import ApexCharts from "apexcharts";
    import { onMount } from "svelte";

    let data = [];

    const options = {
        series: [{
            name: "temperature",
            id: "temperature",
            data: data,
        }],
        chart: {
            type: 'line',
            height: '350px',
            animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: {
                    speed: 1000
                }
            }
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            range: 250,
            labels: {
                show: false,
            }
        },
        yaxis: {
            min: 50,
            max: 100,
            range: 50,
            decimalsInFloat: false,
            labels: {
                show: true,
            }
        },
        stroke: {
            curve: 'straight',
        },
        colors: ['#000000'],
        title: {
            text: 'Temperature'
        }
    }

    onMount(() => {
        let chart = new ApexCharts(document.querySelector("#temperatureChart"), options);
        chart.render();

        window.setInterval(async () => {
            let info = await fetch("http://localhost:5173/api/temperature");
            info = await info.json()
            data.push(parseFloat(info));
            chart.updateSeries([{
                data: data
            }]);
        }, 1000);
    });
    
</script>

<div id="temperatureChart"></div>

<style>

</style>