<script lang="ts">
  export let weather: {
    time: string;
    temperature: number;
    precipitation: number;
    cloudcover: number;
  };
  export let location: string;
</script>

<article
  class="p-5 flex flex-col items-center justify-center gap-1 w-min bg-base-200 rounded-lg"
>
  <div class="flex flex-row justify-center p-2">
    <div class="flex flex-col justify-center items-center">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-16 h-16"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          />
        </svg>
      </div>
    </div>
    <div class="text-5xl p-2">
      {weather.temperature}&deg;F
    </div>
  </div>
  <div>
    <div>
      <span class="text-2xl">{location}</span>
    </div>
  </div>
  <div
    class="flex flex-row justify-evenly border-t-base-300 border-solid w-full p-2"
  >
    <div class="flex flex-col justify-center">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-9 h-9"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
          />
        </svg>
      </div>
      <div>
        {weather.cloudcover * 100}%
      </div>
    </div>
    <div>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-9 h-9"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
          />
        </svg>
      </div>
      <div>
        {weather.precipitation} in.
      </div>
    </div>
  </div>
</article>
