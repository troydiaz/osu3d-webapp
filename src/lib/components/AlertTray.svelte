<script lang="ts">
	import type { InventoryCategory } from "$lib/types/database";
	import { arrow, createFloatingActions } from "svelte-floating-ui";
	import { offset, shift, size } from "svelte-floating-ui/core";
	import { Bell, InformationCircle, XMark } from "svelte-heros-v2";
	import { writable } from "svelte/store";
	import { fade, fly } from "svelte/transition";

  export let showAlerts = true;

  const [floatingRef, floatingContent] = createFloatingActions({
    strategy: 'absolute',
    placement: 'bottom',
    middleware: [
      offset({ crossAxis: 75, mainAxis: 25 }),
    ]
  });
</script>

<!-- <div use:floatingRef on:click={() => showAlerts = !showAlerts} class="{showAlerts ? 'z-20' : ''}">
  <slot />
</div> -->


<div class="fixed top-0 right-0 {showAlerts ? 'translate-x-0' : 'translate-x-full'} h-full w-full max-w-md z-50 transition bg-gradient-to-b from-base-300 to-base-300/80 backdrop-blur">
  <div class="flex flex-col justify-start items-center py-4 gap-4 h-full">
    <div class="text-3xl font-thin py-4"><Bell class="inline mr-2" size={'30px'} />Recent Alerts</div>

    <!-- Notification card -->
    <div class="rounded-lg border border-warning flex flex-col w-full max-w-sm transition cursor-pointer overflow-hidden bg-gradient-to-r from-neutral to-yellow-900">
      <div class="flex flex-row justify-between items-center gap-2 p-4">
        <InformationCircle size={'36px'} class="text-warning" />
        <div class="flex flex-col grow">
          <div class="font-thin">Below Threshold</div>
          <div class="font-light text-xs">0.4mm nozzles are in low supply</div>
        </div>
        <button class="btn btn-square btn-sm btn-ghost"><XMark /></button>
      </div>
      <div class="flex flex-row justify-between items-center bg-base-100 h-8 px-4">
        <div class="text-xs text-mono">6/18/2023, 11:02:37 PM</div>
        <div class="text-xs text-mono">approx. 1 day ago</div>
      </div>
    </div>

    <!-- Notification card -->
    <div class="rounded-lg border border-error flex flex-col w-full max-w-sm transition cursor-pointer overflow-hidden bg-gradient-to-r from-neutral to-red-900">
      <div class="flex flex-row justify-between items-center gap-2 p-4">
        <InformationCircle size={'36px'} class="text-error" />
        <div class="flex flex-col grow">
          <div class="font-thin">Printer Failure</div>
          <div class="font-light text-xs">An issue was reported for Ironman</div>
        </div>
        <button class="btn btn-square btn-sm btn-ghost"><XMark /></button>
      </div>
      <div class="flex flex-row justify-between items-center bg-base-100 h-8 px-4">
        <div class="text-xs text-mono">6/18/2023, 11:00:16 PM</div>
        <div class="text-xs text-mono">approx. 1 day ago</div>
      </div>
    </div>

    <!-- Notification card -->
    <div class="rounded-lg border border-error flex flex-col w-full max-w-sm cursor-pointer overflow-hidden bg- transition bg-gradient-to-r from-neutral to-red-900">
      <div class="flex flex-row justify-between items-center gap-2 p-4">
        <InformationCircle size={'36px'} class="text-error" />
        <div class="flex flex-col grow">
          <div class="font-thin">Printer Failure</div>
          <div class="font-light text-xs">An issue was reported for BB-8</div>
        </div>
        <button class="btn btn-square btn-sm btn-ghost"><XMark /></button>
      </div>
      <div class="flex flex-row justify-between items-center bg-base-100 h-8 px-4">
        <div class="text-xs text-mono">6/18/2023 12:20:32 PM</div>
        <div class="text-xs text-mono">approx. 1 day ago</div>
      </div>
    </div>

    <!-- <div class="grow"></div>

    <div class="w-full">
      <button class="btn btn-error btn-outline w-full max-w-sm">Dismiss All</button>
    </div> -->
  </div>
</div> 

<div class="absolute w-full h-full  z-20 left-0 top-0 transition {showAlerts ? 'bg-gray-800/25 pointer-events-auto' : 'bg-transparent pointer-events-none'}" on:click={() => showAlerts = false}></div>

<!-- {#if showTooltip}
<div class="relative w-52 top-0 z-20" use:floatingContent>
  <div class="rounded-2xl bg-primary p-4 transition flex flex-col gap-2" transition:fly={{ y: 25, duration: 200 }}>
  </div>
</div>

<div class="fixed w-screen h-screen top-0 left-0 bg-neutral-900/50 z-10" transition:fade={{ duration: 200 }} on:click={() => showTooltip = false}></div>
{/if}
 -->

