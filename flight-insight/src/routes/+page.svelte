<script lang="ts">
  import AmericanIcon from "../lib/components/AmericanIcon.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<section
  class="bg-primary h-screen w-screen flex justify-center content-center"
>
  <div class="m-auto lg:w-1/2 w-10/12">
    <main
      class="card bg-base-100 p-4 justify-center content-center  md:w-96 mx-auto mt-10 md:h-128 h-[29rem]"
    >
      <h1 class="card-title m-auto">Find My Flight</h1>
      <div
        class="card-body justify center content center items-center m-auto flex"
      >
        <div class="w-32 h-32 mx-auto md:my-12 my-6">
          <AmericanIcon />
        </div>

        <form
          class="w-full m-auto justify-center items-center text-center"
          method="GET"
          action={data.session?.user ? "/flightcrew" : "/dashboard"}
        >
          <div class="form-control">
            <div class="input-group">
              <input
                type="search"
                placeholder="Record Locator"
                class="input input-bordered"
                name="recordLocator"
              />
              <button type="submit" class="btn btn-square btn-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  /></svg
                >
              </button>
            </div>
          </div>

          <p class="text-neutral-500 mt-3">
            {#if data.session?.user}
              <span>or</span>
              <a href="/auth/signout" class="btn btn-link btn-sm my-2"
                >Sign Out</a
              >
            {:else}
              <span>Are you a flight crew member?</span>
              <a href="/auth/signin" class="btn btn-link btn-sm">Sign In</a>
            {/if}
          </p>
        </form>
      </div>
    </main>
  </div>
</section>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.primary);
  }

  .SignedIn {
    @apply tab-active tab text-neutral-800;
  }
</style>
