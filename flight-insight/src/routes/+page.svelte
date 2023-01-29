<script lang="ts">
  import AmericanIcon from "../lib/components/AmericanIcon.svelte";
  import { signIn, signOut } from "@auth/sveltekit/client";
  let isSignIn = true;

  export let data: PageData;

  function handleSignInClick() {
    isSignIn = true;
  }

  function handleFindFlightClick() {
    isSignIn = false;
  }
</script>

<body class="bg-primary h-screen w-screen flex justify-center content-center">
  <div class="m-auto lg:w-1/2 w-10/12">
    <p class="text-base-100 text-center md:text-4xl text-2xl">
      American Airlines Flight Insight
    </p>
    <div
      class="card bg-base-100 p-2 justify-center content-center text-base-100 md:w-1/2 m-auto mt-10 md:h-128 h-96"
    >
      <div class="card-title m-auto">
        <div class="tabs tabs-boxed">
          <a class={isSignIn ? "SignedIn" : "tab"} on:click={handleSignInClick}
            >Sign In</a
          >
          <a
            class={!isSignIn ? "SignedIn" : "tab"}
            on:click={handleFindFlightClick}>Find My Flight</a
          >
        </div>
      </div>
      <div
        class="card-body justify center content center items-center m-auto flex"
      >
        <div class="w-32 h-32 mb-4">
          <AmericanIcon />
        </div>

        {#if isSignIn}
          <form
            class="w-full m-auto justify-center items-center text-center"
            method="POST"
            action="?/login"
          >
            <input
              name="aadvantage"
              type="text"
              placeholder="AAdvantage Number"
              class="input input-xs w-full max-w-xs bg-base-200 text-neutral m-2"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              class="input input-xs w-full max-w-xs bg-base-200 text-neutral m-2"
            />
            <input
              type="submit"
              value="Log In"
              class="btn btn-primary btn-sm m-auto"
              formaction="?/login"
            />
          </form>
        {:else}
          <form
            class="w-full m-auto justify-center items-center text-center"
            method="GET"
            action="/dashboard"
          >
            <input
              name="recordLocator"
              type="text"
              placeholder="Search"
              class="input input-xs w-full max-w-xs bg-base-200 text-neutral m-2"
            />
            <input
              type="submit"
              value="Search"
              class="btn btn-primary btn-sm m-auto"
            />
          </form>
        {/if}
      </div>
    </div>
  </div>
</body>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.primary);
  }

  .SignedIn {
    @apply tab-active tab text-neutral-800;
  }
</style>
