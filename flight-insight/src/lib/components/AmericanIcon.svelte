<script>
    import { draw } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { select_option } from 'svelte/internal';
    
    let boo = false
    setTimeout(()=>{boo=true},500)
</script>
{#if boo}
<div class="rounded-full bg-base-200 w-full h-full flex">
    <div class="items-center align-middle justify-center m-auto p-2 w-3/4">
        <svg viewBox="0 0 36 58" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path transition:draw="{{duration: 5000, easing: quintOut}}" d="M22.7021 32.7935C21.2553 31.529 13.1833 34.3846 13.1833 34.3846C12.6099 32.9593 20.3611 55.2896 22.1556 56.1448C23.95 57 35 57 35 57L30.0889 46.6425C30.0889 46.6425 25.5868 38.2019 22.7021 32.7935Z" fill="#0078D2"/>
        <path transition:draw="{{duration: 5000, easing: quintOut}}" d="M1 1.50678L11.1056 28.5882L20.8333 28.0181C20.8333 28.0181 11.4833 2.64704 9.97222 1.50678C8.46111 0.366523 1 1.50678 1 1.50678Z" fill="#C30019"/>
        <path transition:draw="{{duration: 5000, easing: quintOut}}" d="M11.1056 28.5882L1 1.50678C1 1.50678 8.46111 0.366523 9.97222 1.50678C11.4833 2.64704 20.8333 28.0181 20.8333 28.0181M11.1056 28.5882L20.8333 28.0181M11.1056 28.5882L13.1833 34.3846M20.8333 28.0181C20.8333 28.0181 25.0833 28.0181 27.4444 28.0181C29.8056 28.0181 33.2056 32.009 33.2056 32.009C33.2056 32.009 35 32.3891 30.0889 32.009C25.1778 31.6289 25.0532 31.529 22.7021 32.7935M13.1833 34.3846C13.1833 34.3846 21.2553 31.529 22.7021 32.7935M13.1833 34.3846C12.6099 32.9593 20.3611 55.2896 22.1556 56.1448C23.95 57 35 57 35 57L30.0889 46.6425C30.0889 46.6425 25.5868 38.2019 22.7021 32.7935" stroke="black"/>
        </svg>
    </div>        
</div>
{/if}