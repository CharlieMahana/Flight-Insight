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
            max: 2,
            range: 2,
            decimalsInFloat: true,
            labels: {
                show: true,
            }
        },
        stroke: {
            curve: 'straight',
        },
        colors: ['#000000'],
        title: {
            text: 'Turbulence (G\'s)'
        }
    }

    onMount(() => {
        let chart = new ApexCharts(document.querySelector("#turbulenceChart"), options);
        chart.render();

        window.setInterval(async () => {
            let info = await fetch("http://localhost:5173/api/turbulence");
            info = await info.json()
            data.push(parseFloat(info/10));
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