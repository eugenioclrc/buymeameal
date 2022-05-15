<script context="module">
  import {
    createClient
  } from '@urql/core';
  import slugify from 'slugify';

  const client = createClient({
    url: 'https://api.thegraph.com/subgraphs/name/eugenioclrc/buymeameal',
  });

  /** @type {import('@sveltejs/kit').Load} */
  export async function load({
    params
  }) {
    console.log(params.username)

    const GET_MYPROFILE = `
    query ($username: String!) {
      profileEntities(where: { username: $username}) {
        id
        username
        avatar
        color
        textColor
        backgroundimg
        bio
        owner {
          id
        }
      }
    }`;

    try {
      const result = await client
        .query(GET_MYPROFILE, {
          username: slugify(params.username).toLocaleLowerCase()
        })
        .toPromise();

      if (!result.data || !result.data.profileEntities.length) {
        return {
          status: 404,
          error: new Error(`Username not found`)
        };
      }

      return {
        props: {
          user: result.data.profileEntities[0],
        }
      };

    } catch (err) {
      return {
        status: 404,
        error: new Error(`Username not found`)
      };
    }
  }
</script>

<script>
  export let user = {};
</script>



<div class="p-relative">
  <div class="p-relative flex flex-both-center" style=" background-color: #{user.color || '1f294f'}">
    <div class="cover-img-wrap p-relative flex flex-both-center w-100" style="min-height: 200px;">
      {#if user.backgroundimg}
      <img
        src="https://cdn.buymeacoffee.com/uploads/cover_images/2020/12/62f662969e8cf8573ccf7c7694400808.jpg@2560w_0e.webp"
        class="object-fit-cover ctr-laazy cover-image">
      {/if}
    </div>
    <div class="upload-circle-loader p-absolute" style="display: none"></div>
  </div>
  <div class="cover-crop-slider flex xxs-flex-wrap p-absolute" id="cover_crop_slider_wrapper" style="display: none;">
    <button id="cover_crop_done_btn"
      class="cr-bold curved-label curved-label-md color-fff mg-l-16 text-fs-14 curved-label-own-color p-relative bg-dark-05-h flex flex-vert-center crop-btn">
      Save Changes
    </button>
    <button id="cover_crop_cancel_btn"
      class="cr-bold curved-label curved-label-md mg-l-16 text-fs-14 curved-label-own-color p-relative flex flex-vert-center cover-crop-cancel color-dark bg-fff ctr-box-shadow-new">
      Cancel
    </button>
  </div>
</div>


<div class="xs-hide-shadow p-relative bg-fff ctr-br-btm-2-222-005   hide-br-on-mob">
  <div class="full-width-head nl-image placeholder-img no-featured-wrapper mg-0-a p-relative xs-pd-t-0 w-full">
    <div class="flex flex-sp-between pd-b-24 xs-pb-10 ">
      <div class="full-width-content mg-0-a text-center w-full">
        <div class="h-36 mx-auto w-full">
          <div class="p-relative xs-text-center  ctr-profile-pic-wrap-org ctr-profile-pic-wrap  ">
            <a href="https://www.buymeacoffee.com/ccchristian" class="p-absolute ab-link"></a>
            {#if user.avatar}
            <img
              src="https://cdn.buymeacoffee.com/uploads/profile_pictures/2020/12/d1dcf12336309e1a95607d2911bbe003.jpg@300w_0e.webp"
              class="img-centered rounded-circle rounded-full border-4 border-white -mt-28 h-36 w-36 object-cover mx-auto" />
            {:else}
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"

            class="img-centered rounded-circle rounded-full border-4 border-white -mt-28 h-36 w-36 object-cover mx-auto bg-gray-400" 
 width="1280.000000pt" height="1280.000000pt" viewBox="0 0 1280.000000 1280.000000"
 preserveAspectRatio="xMidYMid meet">
<g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">
<path d="M6150 11245 c-418 -57 -782 -234 -1084 -525 -759 -733 -785 -1937
-58 -2701 733 -771 1945 -802 2714 -70 648 616 786 1596 334 2365 -262 445
-699 769 -1201 892 -216 53 -494 68 -705 39z"/>
<path d="M4770 6804 c-14 -2 -59 -9 -100 -15 -41 -5 -124 -23 -185 -39 -654
-172 -1166 -716 -1299 -1380 -34 -171 -36 -251 -36 -2042 l0 -1788 3250 0
3250 0 0 1788 c0 1791 -2 1871 -36 2042 -131 656 -638 1201 -1280 1376 -228
62 -94 57 -1894 60 -905 1 -1656 0 -1670 -2z"/>
</g>
</svg>

            {/if}
          </div>
        </div>
        <div class="xs-mw-none w-100 mg-t-6 head-name-sec text-center mg-0-a">
          <div>
            <div class="p-relative dis-inline-block w-100 xs-pd-l-16 xs-pd-r-16">
              <h1
                class="creator-pg-head-content text-fs-20 xs-text-fs-20 clr-dark mg-0 ln-h-30 work-break creator-head-text flex flex-col">
                <span class="font-bold  w-100 text-2xl">{user.username}</span>
                <a href="https://mumbai.polygonscan.com/address/{user.owner.id}" target="_blank" class="text-sm">
                  {user.owner.id.slice(0, 6)}...{user.owner.id.slice(-6)}
                </a>
              </h1>
            </div>
            <div class="">0 supporters</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>
<div class="mx-auto max-w-6xl px-4 sm:px-6 xl:max-w-5xl xl:px-0 flex flex-col md:flex-row">
  <div class="w-full md:w-2/3 border rounded bg-white p-2 m-2">
    {JSON.stringify(user)}

  </div>
  <div class="w-full md:w-1/3 border rounded bg-white px-6 py-2 flex flex-col">
    <div class="text-2xl text-center">
      Buy <span class="font-bold">{user.username}</span> a meal<br />
    </div>
    <div class="rounded border border-red-300 bg-red-100 flex flex-row py-4 px-5 my-4 place-items-center">
      <img alt="Workflow" class="h-12 w-12 rounded-full" src="/logo.png">
      <span class="ml-4">X</span>
      <div class="flex flex-row justify-between">
        <button class="rounded-full border border-red-300 hover:border-red-500 text-red-500 bg-white h-9 w-9 ml-1 text-center font-bold">1</button>
        <button class="rounded-full border border-red-300 hover:border-red-500 text-red-500 bg-white h-9 w-9 ml-1 text-center font-bold">3</button>
        <button class="rounded-full border border-red-300 hover:border-red-500 text-red-500 bg-white h-9 w-9 ml-1 text-center font-bold">5</button>
      </div>

    </div>
  </div>
</div>