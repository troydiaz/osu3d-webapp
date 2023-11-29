<script lang="ts">
	import type { PageData } from "./$types";
	import PrintLogTier from "$lib/components/PrintLogTier.svelte";
	import log from '$lib/images/log.png';
  import info from '$lib/images/info.png';
  import josef_light from '$lib/images/josef_light.png';
  import josef_dark from '$lib/images/josef_dark.png';

  export let data: PageData;
  const { session, machines, userLevel } = data;
</script>

<svelte:head>
    <title>Dashboard | OSU 3D</title>
</svelte:head>

{#if machines && userLevel}
<div class="flex flex-col gap-12 w-full">
    <div class="h-24 window relative overflow-hidden flex flex-row justify-between items-center">
        <div class="flex-row gap-4 items-center hidden md:flex">
            <div class="text-3xl font-thin">Hello</div>
            <div class="text-3xl font-mono bg-base-200 px-2 rounded-lg py-1 border border-base-content/20">{session.user.email}</div>
        </div>
        <div class="grow"></div>
        <div class="lg:text-5xl text-3xl font-thin z-10">Dashboard</div>
        <img src={log} class="absolute right-32 top-12 blur-[1px] scale-[5] w-16 h-16  opacity-25 pointer-events-none select-none" />
    </div>

    <div class="flex flex-row justify-center md:justify-end items-center bg-gradient-to-br from-info/10 to-info/30 p-8 md:rounded-xl relative outline outline-info/50 lg:pr-24">
        
        <div class="text-info-content">
          <article class="prose prose-blue prose-sm">
            <h2>Josef Bot is at your service...</h2>
            <ul>
              <li>Automatic server roles</li>
              <li>Get pings about your prints</li>
              <li>Be notified when a printer is available</li>
              <li>Add your Discord username in <a href="/account">Settings</a></li>
            </ul>
          </article>
        </div>
    
        <img id="josef-light" src={josef_light} class="hidden md:block absolute h-full left-[4px] rounded-xl -translate-x-1 pointer-events-none select-none" />
        <img id="josef-dark" src={josef_dark} class="hidden md:block absolute h-full left-[4px] rounded-xl -translate-x-1 pointer-events-none select-none" />
        <img src={info} class="absolute right-1/2 -top-2 lg:right-3 lg:top-3 -translate-y-1/2 translate-x-1/2 w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-blue-500 p-1 border-4 border-blue-300 dark:border-blue-700" />
    </div>


    <PrintLogTier machines={machines.filter(m => m.tier === 1)} tier={1} userLevel={userLevel} />
    
    <!-- For Bambu Labs printers -->
    <PrintLogTier machines={machines.filter(m => m.tier === 99)} tier={99} userLevel={userLevel} />

    <PrintLogTier machines={machines.filter(m => m.tier === 2)} tier={2} userLevel={userLevel} />
    <PrintLogTier machines={machines.filter(m => m.tier === 3)} tier={3} userLevel={userLevel} />
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