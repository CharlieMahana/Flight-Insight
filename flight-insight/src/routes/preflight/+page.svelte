<script>
    import AmericanIcon from "../../lib/components/AmericanIcon.svelte";
    let temp = Math.floor(Math.random() * 20 + 60)
    let turbulence = Math.floor(Math.random() * 40 + 10)
    let humidity = Math.floor(Math.random() * 50 + 10)
</script>

<div class="bg-primary h-screen w-screen flex justify-center content-center items-center">
    <div class="h-196 md:w-128 w-96 md:p-0 p-4">
        <div class="carousel rounded-box">
            <div class="carousel-item w-full justify-center items-center bg-neutral-50">
                <div class="columns-1 p-10 text-center justify-center content-center items-center m-auto">
                    <div class="w-1/2 h-1/2 m-auto">
                        <AmericanIcon></AmericanIcon>
                    </div>
                    <h1 class="text-7xl my-8">PREFLIGHT</h1>
                </div>
            </div> 
            <div class="carousel-item w-full justify-center items-center bg-neutral-50">
                <div class="columns-1 p-10 h-144 text-center justify-center items-center my-8">
                    <h1 class="text-9xl">❄</h1>
                    <h1 class="text-4xl">The cabin temperature is</h1>
                    <h1 class="text-9xl my-6">{temp}°F</h1>
                    {#if temp <= 68}
                        <h1 class="text-4xl">Consider bringing a <b>jacket</b> on-board.</h1>
                    {:else}
                        <h1 class="text-4xl">You may not need a jacket on-board.</h1>
                    {/if}
                </div>
              <!-- <img src="https://daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.jpg" class="w-full" alt="Tailwind CSS Carousel component" /> -->
            </div> 
            <div class="carousel-item w-full bg-neutral-50">
                <div class="columns-1 p-10 h-144 text-center justify-center items-center my-8">
                    <h1 class="text-8xl">✈︎</h1>
                    <h1 class="text-4xl">The chance of severe turbulence is</h1>
                    <div class="radial-progress my-6" style="--value:{turbulence}; --size:8rem; --thickness: 1rem;">{turbulence}%</div>
                    {#if turbulence >= 50}
                        <h1 class="text-4xl">Consider <b>upgrading your seats</b> and bringing <b>motion sickness</b> medication.</h1>
                    {:else}
                        <h1 class="text-4xl">If you are prone to motion sickness, consider preventative care.</h1>
                    {/if}
                </div>
            </div> 
            <div class="carousel-item w-full bg-neutral-50">
                <div class="columns-1 p-10 h-144 text-center justify-center items-center my-8">
                    <h1 class="text-8xl">☁</h1>
                    <h1 class="text-4xl">The cabin humidity is</h1>
                    <div class="radial-progress my-6" style="--value:{humidity}; --size:8rem; --thickness: 1rem;">{humidity}%</div>
                    {#if humidity <= 40}
                        <h1 class="text-4xl">Consider bringing TSA-approved ointments and eye drops.</h1>
                    {:else}
                        <h1 class="text-4xl">If you are prone to low humidity effects, consider preventative care.</h1>
                    {/if}
                </div>
              <!-- <img src="https://daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.jpg" class="w-full" alt="Tailwind CSS Carousel component" /> -->
            </div> 
        </div>
    </div>
</div>

<style>

</style>