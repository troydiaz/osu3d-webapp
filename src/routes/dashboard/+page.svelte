<script lang="ts">
  import type { PageData } from "./$types";
  import PrintLogTier from "./PrintLogTier.svelte";
  import log from '$lib/images/log.png';
  import info from '$lib/images/info.png';
  import josef_light from '$lib/images/josef_light.png';
  import josef_dark from '$lib/images/josef_dark.png';

  export let data: PageData;
  const { permissions, routeData } = data;
</script>

<svelte:head>
  <title>Dashboard | OSU 3D</title>
</svelte:head>

{#if routeData && permissions}
<div class="flex flex-col gap-12 w-full">
  <div class="md:h-24 h-12 relative overflow-hidden flex flex-row justify-between items-center bg-base-100 border border-base-content/5 md:rounded-2xl p-8 gap-4">
    <div class="md:text-3xl text-xl font-thin pr-6 z-10">Dashboard</div>
    <div class="grow"></div>
    <img src={log} alt="Page banner" class="hidden md:block absolute right-32 top-12 blur-[0.75px] scale-[4] w-16 h-16 opacity-25 pointer-events-none select-none" />
  </div>

  <div class="flex flex-row justify-center md:justify-end items-center bg-gradient-to-br from-info/10 to-info/30 p-8 md:rounded-xl relative outline outline-1 outline-base-content/5 lg:pr-24">
      
    <div class="text-info-content">
      <article class="prose prose-blue prose-sm">
        <h3>Josef Bot is at your service...</h3>
        <ul>
          <li>Automatic server roles</li>
          <li>Get pings about your prints</li>
          <li>Be notified when a printer is available</li>
          <li>Add your Discord username in <a href="/account">Settings</a></li>
        </ul>
      </article>
    </div>

    <img alt="Josef" id="josef-light" src={josef_light} class="hidden md:block absolute h-full left-[4px] rounded-xl -translate-x-1 pointer-events-none select-none" />
    <img alt="Josef" id="josef-dark" src={josef_dark} class="hidden md:block absolute h-full left-[4px] rounded-xl -translate-x-1 pointer-events-none select-none" />
    <img alt="Info icon" src={info} class="absolute right-1/2 -top-2 lg:right-3 lg:top-3 -translate-y-1/2 translate-x-1/2 w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-blue-500 p-1 shadow" />
  </div>


  <PrintLogTier routeData={routeData.filter(m => m.tier === 1)} tier={1} userLevel={permissions} />
  
  <!-- For Bambu Labs printers -->
  <PrintLogTier routeData={routeData.filter(m => m.tier === 99)} tier={99} userLevel={permissions} />

  <PrintLogTier routeData={routeData.filter(m => m.tier === 2)} tier={2} userLevel={permissions} />

  <!-- For the Snapmaker -->
  <PrintLogTier routeData={routeData.filter(m => m.tier === 98)} tier={98} userLevel={permissions} />

  <PrintLogTier routeData={routeData.filter(m => m.tier === 3)} tier={3} userLevel={permissions} />
</div>
{/if}

<style>
  #josef-light, #josef-dark {
    -webkit-mask-image: linear-gradient(to left, transparent 0%, black 50%);
    mask-image: linear-gradient(to left, transparent 0%, black 50%);
  }

  :global(html[data-theme="light"] #josef-dark)  {
    display: none !important;
  }

  :global(html[data-theme="dark"] #josef-light) {
    display: none !important;
  }
</style>