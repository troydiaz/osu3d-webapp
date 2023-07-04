<script lang="ts">
	import { createFloatingActions } from "svelte-floating-ui";
	import { offset } from "svelte-floating-ui/core";
	import { Bell, InformationCircle, XMark } from "svelte-heros-v2";
	import { fade } from "svelte/transition";
	import Alert from "./Alert.svelte";
	import { AlertType } from "$lib/types/alerts";
	import { subDays } from "date-fns";

  export let showAlerts = true;

  const [floatingRef, floatingContent] = createFloatingActions({
    strategy: 'absolute',
    placement: 'bottom',
    middleware: [
      offset({ crossAxis: 75, mainAxis: 25 }),
    ]
  });
</script>

<div class="fixed top-0 right-0 {showAlerts ? 'translate-x-0' : 'translate-x-full'} h-full w-full max-w-md z-50 transition bg-gradient-to-b from-base-300 to-base-300/80 backdrop-blur">
  <div class="flex flex-col justify-start items-center py-4 gap-4 h-full">
    <div class="text-3xl font-thin py-4"><Bell class="inline mr-2" size={'30px'} />Recent Alerts</div>

    <Alert dateString={subDays(new Date(), 0).toISOString()} type={AlertType.LOW_INVENTORY} message="0.4mm nozzles are in low supply" />
    <Alert dateString={subDays(new Date(), 0).toISOString()} type={AlertType.PRINTER_FAULT} message="An issue was reported for Ironman" />
    <Alert dateString={subDays(new Date(), 0).toISOString()} type={AlertType.PRINTER_FAULT} message="An issue was reported for BB-8" />
  </div>
</div> 

{#if showAlerts}
  <div class="fixed w-full h-full z-20 left-0 top-0 bg-gray-800/50" on:click={() => showAlerts = false} transition:fade={{ duration: 150 }}></div>
{/if}
