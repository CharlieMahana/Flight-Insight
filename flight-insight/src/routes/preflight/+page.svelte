<script>
    import AmericanIcon from "../../lib/components/AmericanIcon.svelte";
    let temp = Math.floor(Math.random() * 20 + 60)
    let turbulence = Math.floor(Math.random() * 40 + 10)
    let humidity = Math.floor(Math.random() * 50 + 10)
    import { page } from '$app/stores';
    
    const recordLocator = $page.url.searchParams.get('recordLocator');
</script>

<div class="bg-primary h-screen w-screen flex justify-center content-center items-center">
    <div class="h-196 md:w-128 w-96 md:p-0 p-4">
        <div class="carousel rounded-box">
            <div class="carousel-item w-full justify-center items-center bg-neutral-50">
                <div class="columns-1 p-10 text-center justify-center content-center items-center m-auto">
                    <div class="w-1/2 h-1/2 m-auto">
                        <AmericanIcon></AmericanIcon>
                    </div>
                    <h1 class="text-5xl my-8">What to expect from your flight</h1>
                    <h1 class="text-lg italic my-8 text-neutral-500">Swipe to continue...</h1>
                </div>
            </div> 
            <div class="carousel-item w-full justify-center items-center bg-neutral-50">
                <div class="columns-1 p-10 h-144 text-center justify-center items-center my-8">
                    <h1 class="text-9xl">❄</h1>
                    <h1 class="text-3xl">The cabin temperature is</h1>
                    <h1 class="md:text-8xl text-6xl my-6">{temp}°F</h1>
                    {#if temp <= 68}
                        <h1 class="text-3xl">Consider bringing a <b>jacket</b> on-board.</h1>
                    {:else}
                        <h1 class="text-3xl">You may not need a jacket on-board.</h1>
                    {/if}
                </div>
              <!-- <img src="https://daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.jpg" class="w-full" alt="Tailwind CSS Carousel component" /> -->
            </div> 
            <div class="carousel-item w-full bg-neutral-50">
                <div class="columns-1 p-10 h-144 text-center justify-center items-center my-8">
                    <h1 class="text-8xl">✈︎</h1>
                    <h1 class="text-3xl">The chance of severe turbulence is</h1>
                    <div class="radial-progress my-6" style="--value:{turbulence}; --size:8rem; --thickness: 1rem;">{turbulence}%</div>
                    {#if turbulence >= 50}
                        <h1 class="text-3xl">Consider <b>upgrading your seats</b> and bringing <b>motion sickness</b> medication.</h1>
                    {:else}
                        <h1 class="text-3xl">If you are prone to motion sickness, consider <b>preventative care</b>.</h1>
                    {/if}
                </div>
            </div> 
            <div class="carousel-item w-full bg-neutral-50">
                <div class="columns-1 p-10 h-144 text-center justify-center items-center my-8">
                    <h1 class="text-8xl">☁</h1>
                    <h1 class="text-3xl">The cabin humidity is</h1>
                    <div class="radial-progress my-6" style="--value:{humidity}; --size:8rem; --thickness: 1rem;">{humidity}%</div>
                    {#if humidity <= 40}
                        <h1 class="text-3xl">Consider bringing TSA-approved <b>lotion</b> and <b>eye drops</b>.</h1>
                    {:else}
                        <h1 class="text-3xl">If you are prone to low humidity effects, consider <b>preventative care</b>.</h1>
                    {/if}
                </div>
              <!-- <img src="https://daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.jpg" class="w-full" alt="Tailwind CSS Carousel component" /> -->
            </div> 
            <div class="carousel-item w-full bg-neutral-50">
                <div class="columns-1 p-10 text-center justify-center items-center m-auto">
                    <img src="https://www.freightwaves.com/wp-content/uploads/2019/04/737americanairlines-2.png" alt="">
                    <a class="btn btn-primary" href="/dashboard?recordLocator={recordLocator}">Enjoy your flight</a>
                </div>
            </div> 
        </div>
    </div>
</div>

<style>

</style>