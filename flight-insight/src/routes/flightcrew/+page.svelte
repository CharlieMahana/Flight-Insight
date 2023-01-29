<script>
    import TurbulenceChart from "$lib/components/TurbulenceChart.svelte";
    import HumidityChart from "$lib/components/HumidityChart.svelte";
    import TemperatureChart from "$lib/components/TemperatureChart.svelte";
</script>

<div>
    <TurbulenceChart></TurbulenceChart>
    <br>
    <HumidityChart></HumidityChart>
    <br>
    <TemperatureChart></TemperatureChart>
</div>

<style>
    div {
        display: flex  !important;
        flex-direction: column;
    }
</style>