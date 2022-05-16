<script context="module">
  export const prerender = true;

  /*
Queries (HTTP):     https://api.thegraph.com/subgraphs/name/eugenioclrc/buymeameal
Subscriptions (WS): wss://api.thegraph.com/subgraphs/name/eugenioclrc/buymeameal
*/
</script>
<script>
  import {
    enhance
  } from '$lib/form';
  import {
    onConnect,
    onDisconnect
  } from '$lib/web3';
  import {
    connected,
    signerAddress,
    contracts
  } from 'svelte-ethers-store'
  import slugify from 'slugify';

  import {
    initClient
  } from '@urql/svelte';
  import {
    operationStore,
    query
  } from '@urql/svelte';
import { ethers } from 'ethers';

  initClient({
    url: 'https://api.thegraph.com/subgraphs/name/eugenioclrc/buymeameal',
  });


  const GET_MYPROFILE = operationStore(`
    query ($owner: String!) {
      user(id: $owner ) {
        id
        tokens {
          id
          username
          totalSupporters
          balance
          totalGain
        }
      }  
    }`);

  query(GET_MYPROFILE);
  $: GET_MYPROFILE.variables = {
    owner: ($signerAddress || '').toLocaleLowerCase()
  }


  const GET_PROFILE = operationStore(`
    query ($username: String!) {
      profileEntities(where: { username: $username }) {
        id
      }  
    }`);

  query(GET_PROFILE);


  const PROFILES = operationStore(`
    query {
      profileEntities(first: 5) {
        id
        username
        totalSupporters
        avatar
      }  
    }`);

  query(PROFILES);


  let usernameTaken = false;
  let username = '';
  let usernameStr = '';


  $: if (!$GET_PROFILE.fetching) {
    usernameTaken = usernameStr.length > 4 && $GET_PROFILE.data.profileEntities && $GET_PROFILE.data.profileEntities
      .length > 0;
  }

  $: usernameStr = slugify(username, '_');


  $: if (username) {
    usernameTaken = false;
    if (usernameStr.length > 4) {
      $GET_PROFILE.variables = {
        username: usernameStr
      };
    }
  }

  let pendingTx = false;
  async function createProfile({
    response
  }) {
    const data = await response.json();
    try {
      pendingTx = true;
      const tx = await $contracts.ProfileBMAM.safeMint(data.username, $signerAddress, data.signature);
      await tx.wait(0);
      pendingTx = false;
    } catch (err) {
      pendingTx = false;
      username = usernameStr;
      alert("sorry there is an error")
    }
  }

  // getProfile('eugenioclrc').then(({ data }) => {
  //     console.log(data);
  //   });
  // });
  /*
  $GET_PROFILE.

  */
</script>



<svelte:head>
  <title>Buy Me A Meal</title>
  <meta name="description"
    content="Buy Me a Meal is the best decentralized way for creators and artists to accept crypto support from their fans." />
</svelte:head>

<div class="max-w-7xl mx-auto">
  <div class=" z-10 m-0 md:m-8 md:rounded-3xl bg-white">
    <div class="px-6 py-4 ">
      <nav class=" flex items-center justify-between sm:h-10 " aria-label="Global">
        <div class="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
          <div class="flex items-center justify-between w-full md:w-auto">
            <a href="/">
              <span class="sr-only">Buy me a Meal</span>
              <img alt="Meal" class="h-8 w-auto sm:h-10" src="/logo.png">
            </a>
          </div>
        </div>
        <div class="block md:ml-10 md:pr-4 md:space-x-8">
          <a href="#"
            class="text-sm md:text-base font-medium p-3 rounded-full text-gray-500 hover:bg-slate-200 hover:text-gray-900 transition-all">Faq</a>
          <a href="#"
            class="text-sm md:text-base font-medium p-3 rounded-full text-gray-500 hover:bg-slate-200 hover:text-gray-900 transition-all">Company</a>
          <button on:click={$connected ? onDisconnect: onConnect}
            class="text-sm md:text-base font-medium p-3 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition-all focus:ring-indigo-500">
            {$connected ? ($signerAddress.slice(0,6)+'...'+$signerAddress.slice(-4)) : 'Connect'}
          </button>

        </div>
      </nav>
    </div>

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
                
                {#if $GET_MYPROFILE && $GET_MYPROFILE.data && $GET_MYPROFILE.data.user && $GET_MYPROFILE.data.user.tokens.length}
                  <div class="w-full mb-12 px-4">
                    <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
                      <div class="rounded-t mb-0 px-4 py-3 border-0">
                        <div class="flex flex-wrap items-center">
                          <div class="relative w-full px-4 max-w-full flex-grow flex-1">
                            <h3 class="font-semibold text-lg text-blueGray-700">You Profiles</h3>
                          </div>
                        </div>
                      </div> 
                      <div class="block w-full overflow-x-auto">
                        <table class="items-center w-full bg-transparent border-collapse">
                          <thead>
                            <tr>
                              <th class="th-Head">Url</th>
                              <th class="th-Head">Claimable</th>
                              <th class="th-Head">TVL</th>
                              <th class="th-Head">Backers</th>
                              <th class="th-Head">Actions</th>
                              <th class="th-Head">
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                          {#each $GET_MYPROFILE.data.user.tokens as t}
                            <tr>
                              <th class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left pl-3 font-normal">
                                <a href="#">
                                  <!-- <img src="/notus-svelte/assets/img/bootstrap.jpg" class="h-12 w-12 bg-white rounded-full border" alt="..."> -->
                                  /buymeameal/<span class="font-bold btext-blueGray-600">{t.username}</span>
                                </a>
                              </th>
                              <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {ethers.utils.formatEther(t.balance || '0', 6)}
                              </td>
                              <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {ethers.utils.formatEther(t.totalGain || '0', 6)}
                              </td>
                              <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {t.totalSupporters || 0}
                              </td>
                              <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                                  <button type="button" class="inline-block px-2 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mr-1">View</button>
                                  <button type="button" class="inline-block px-2 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out">Edit</button>
                                  <button type="button" class="inline-block px-2 py-2.5 bg-green-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out">Harvest</button>
                              </td>
                            </tr>
                          {/each}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  
                {:else}
                  <form action="/pindata" method="post"
                      use:enhance={{ result: createProfile }}>
                    
                    <div class="w-600 h-74 pl-24 pr-4 relative mx-auto border-2 border-gray-300 rounded-full bg-white shadow-xs flex items-center xs:w-full text-xl"
                    class:border-red-600={usernameTaken}>
                      <input name="userAddress" type="hidden" value={$signerAddress} />
                      <label for="userName" class="text-24 font-cr-medium font-bold xxs:text-18">/buymeameal/</label>
                      <input id="userName" bind:value={username} name="username" placeholder="yourname" class="text-24 font-cr-regular text-dark w-11/12 xxs:text-18 xxs:w-full focus:outline-0"
                      minlength="5">
                      <button class="bg-yellow-300 rounded-full text-16 all-transition flex-both-center relative px-6 my-2 btn-with-bg-yellow h-12 text-20 flex-shrink-0" type="submit">
                        <span class="inline-flex relative"><!---->
                          <span class="font-semibold">Start my page</span> <!---->
                        </span> <!---->
                      </button>
                    </div>
                    {#if usernameTaken}
                      <div class="text-red-600 font-bold">Sorry... Username is taken</div>
                    {/if}
                  </form>
                {/if}
							</div>
						{/if}
          </div>
        </div>
        <div class="flex flex-wrap justify-between">


            {#if $PROFILES.fetching}
  <p>Loading...</p>
  {:else if $PROFILES.error}
  <p>Oh no... {$PROFILES.error.message}</p>
  {:else}
    {#each $PROFILES.data.profileEntities as p}
      <div class="max-w-sm rounded overflow-hidden shadow-lg bg-white m-2 w-[200px]">
        <div class="w-200 h-200 overflow-hidden">
          <a href={'/'+p.username}>
            <img width="200" height="200" src="#dsa" alt="name" class="scale-200 w-[200px] h-[200px] object-cover transform hover:scale-105 duration-300 bg-slate-400">
          </a>
        </div>
        
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">
            <a href={'/'+p.username}>{p.username}</a>
          </div>
          <div class="text-sm text-black font-regular mt-1 leading-19 flex">
            <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-1 mt-0.5"><path d="M8.98699 15.4375L7.90109 14.449C4.04429 10.9516 1.49805 8.64505 1.49805 5.81423C1.49805 3.50764 3.31037 1.69531 5.61697 1.69531C6.92004 1.69531 8.17069 2.30192 8.98699 3.2605C9.80328 2.30192 11.0539 1.69531 12.357 1.69531C14.6636 1.69531 16.4759 3.50764 16.4759 5.81423C16.4759 8.64505 13.9297 10.9516 10.0729 14.4565L8.98699 15.4375Z" stroke="black" stroke-width="1.49779"></path></svg>
                      {p.totalSupporters} Supporters
          </div>        
        </div>
      </div>
    {/each}
  {/if}
      
        </div>

       
      </main>
    </div>
  </div>

  
</div>
<style>
.th-Head{ 
  @apply px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blue-50 text-blue-500 border-blue-100;
}    
</style>

