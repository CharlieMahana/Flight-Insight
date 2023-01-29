<script lang='ts'>
    import ApexCharts from "apexcharts";
    import { onMount } from "svelte";

    let data = [];

    const options = {
        series: [{
            name: "turbulence",
            id: "turbulence",
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
            min: 0,
            max: 20,
            range: 20,
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
            text: 'Turbulence Delta (m/s^2)'
        }
    }

    onMount(() => {
        let chart = new ApexCharts(document.querySelector("#turbulenceChart"), options);
        chart.render();

        window.setInterval(async () => {
            let info = await fetch("http://localhost:5173/api/turbulence");
            info = await info.json()
            data.push(parseFloat(info));
            chart.updateSeries([{
                data: data
            }]);
        }, 1000);
    });
    
</script>

<div id="turbulenceChart"></div>

<style>
    div {
        width: 100%;
        margin: 20px;
    }
</style>