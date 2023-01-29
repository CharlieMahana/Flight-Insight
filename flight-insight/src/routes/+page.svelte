<body class="bg-primary h-screen w-screen flex justify-center content-center">
  <div class="m-auto lg:w-1/2 w-10/12">
    <!-- <p class="text-base-100 text-center md:text-4xl text-2xl font-roboto">American Airlines Flight Insight</p> -->
    <div class="card bg-base-100 p-4 justify-center content-center text-base-100 md:w-96 m-auto mt-10 md:h-128">
      <div class="card-title m-auto">
        <div class="tabs tabs-boxed">
          <a class="{isSignIn ? 'SignedIn' : 'tab'}" on:click={handleSignInClick}>Sign In</a> 
          <a class="{!isSignIn ? 'SignedIn' : 'tab'}" on:click={handleFindFlightClick}>Find My Flight</a>   
        </div>
      </div>
      <div class="card-body justify center content center items-center m-auto flex">
        <div class="w-32 h-32 mx-auto md:my-12 my-6">
          <AmericanIcon></AmericanIcon>
        </div>
        
        {#if isSignIn}
          <form class="w-full m-auto justify-center items-center text-center" method="POST" action="?/login">
            <input name="aadvantage" type="text" placeholder="AAdvantage Number" class="input input-sm w-full max-w-xs bg-base-200 text-neutral my-2" />
            <input name="password" type="password" placeholder="Password" class="input input-sm w-full max-w-xs bg-base-200 text-neutral my-2" />
            <input type="button" value="Log In" class="btn btn-primary btn-sm my-2" formaction="?/login"/>
          </form>
        {:else}
        <form class="w-full m-auto justify-center items-center text-center" method="POST" action="?/search">
          <input name="search" type="text" placeholder="Search" class="input input-sm w-full max-w-xs bg-base-200 text-neutral my-2" />
          <input type="button" value="Search" class="btn btn-primary btn-sm my-2" />
        </form>
        {/if}
      </div>
    </div>
  </div>
  {#if form?.success}
    <p>Successfully filled form</p>
  {/if}
</body>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.primary);
  }

  .SignedIn{
    @apply tab-active tab text-neutral-800
  }
  
  
</style>

<script>
  import AmericanIcon from "../lib/components/AmericanIcon.svelte";
  let isSignIn = true;

  /** @type {import('./$types').ActionData} */
  export let form;

  function handleSignInClick(){
    isSignIn=true;
    console.log(isSignIn);
  }

  function handleFindFlightClick(){
    isSignIn=false;
    console.log(isSignIn);
  }
</script>
