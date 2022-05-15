<script context="module">
	export const prerender = true;
</script>
<script>
	import { enhance } from '$lib/form';
  import { onConnect, onDisconnect } from '$lib/web3';
	import { connected, signerAddress } from 'svelte-ethers-store'

  import { gql } from '@apollo/client';
  import { query } from "svelte-apollo";


  function getProfile(username) {
    const GET_PROFILE = gql`
    query getMyTodos {
      profileEntities(where: { username: "${username}"}) {
        id
        username
        owner
        avatar
      }  
    }`;

    return query(GET_PROFILE);    
  }
  

</script>

<svelte:head>
	<title>Buy Me A Meal</title>
	<meta name="description" content="Buy Me a Meal is the best decentralized way for creators and artists to accept crypto support from their fans." />
</svelte:head>

<div class="max-w-7xl mx-auto">
    <div class=" z-10 m-0 md:m-8 md:rounded-3xl bg-white">      
      <div class="px-6 py-4 ">
          <nav class=" flex items-center justify-between sm:h-10 " aria-label="Global">
            <div class="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
              <div class="flex items-center justify-between w-full md:w-auto">
                <a href="/">
                  <span class="sr-only">Buy me a Meal</span>
                  <img alt="Workflow" class="h-8 w-auto sm:h-10" src="/logo.png">
                </a>
              </div>
            </div>
            <div class="block md:ml-10 md:pr-4 md:space-x-8">
              <a href="#" class="text-sm md:text-base font-medium p-3 rounded-full text-gray-500 hover:bg-slate-200 hover:text-gray-900 transition-all">Faq</a>
              
              <a href="#" class="text-sm md:text-base font-medium p-3 rounded-full text-gray-500 hover:bg-slate-200 hover:text-gray-900 transition-all">Company</a>
							<button on:click={$connected ? onDisconnect: onConnect} class="text-sm md:text-base font-medium p-3 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition-all focus:ring-indigo-500">
								{$connected ? ($signerAddress.slice(0,6)+'...'+$signerAddress.slice(-4)) : 'Connect'}
							</button>
							
            </div>
          </nav>
        </div>

        <!--
          Mobile menu, show/hide based on menu open state.

          Entering: "duration-150 ease-out"
            From: "opacity-0 scale-95"
            To: "opacity-100 scale-100"
          Leaving: "duration-100 ease-in"
            From: "opacity-100 scale-100"
            To: "opacity-0 scale-95"
        -->
    
      </div>
  </div>


<!-- This example requires Tailwind CSS v2.0+ -->
<div class="relative  overflow-hidden">
  <div class="max-w-7xl mx-auto">
    <div class=" z-10 pb-8 ">      
     

      <main class="mt-10 mx-auto max-w-7xl px-4">
        <div class="text-center">
          <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl flex flex-col">
            <span class="block xl:inline pb-2">A crypto supporter is worth</span>
            <span class="block text-indigo-600 xl:inline">a thousand followers.</span>
          </h1>
          <p class="mt-3 text-base text-gray-700 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
            Accept crypto donations. Start mit a membership. Sell anything you like. It’s easier than you think.
          </p>
          <div class="mt-5 sm:mt-8 sm:flex justify-center ">
						{#if !$connected}
							<div class="rounded-md shadow">
								<a href="#" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"> Get started </a>
							</div>
							<div class="mt-3 sm:mt-0 sm:ml-3">
								<a href="#" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"> Live demo </a>
							</div>
						{:else}
							<div class="mt-3 sm:mt-0 sm:ml-3">
                <form action="/pindata" method="post"
                    use:enhance={{
                      result: async ({ form }) => {
                        form.reset();
                      }
                    }}
                  >
									
								<div class="w-600 h-74 pl-24 pr-4 relative mx-auto border-2 border-gray-300 rounded-full bg-white shadow-xs flex items-center xs:w-full text-xl">
                  <input name="userAddress" type="hidden" value={$signerAddress} />
                    <label for="userName" class="text-24 font-cr-medium font-bold xxs:text-18">/buymeameal/</label>
                    <input id="userName" name="username" placeholder="yourname" class="text-24 font-cr-regular text-dark w-11/12 xxs:text-18 xxs:w-full focus:outline-0"
                    minlength="5">
                    <button class="bg-yellow-300 rounded-full text-16 all-transition flex-both-center relative px-6 my-2 btn-with-bg-yellow h-12 text-20 flex-shrink-0" type="submit">
                      <span class="inline-flex relative"><!---->
                        <span class="font-semibold">Start my page</span> <!---->
                      </span> <!---->
                    </button>
                  </div>
                </form>
							</div>
						{/if}
          </div>
        </div>
      </main>
    </div>
  </div>
</div>
