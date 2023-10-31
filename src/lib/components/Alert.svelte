<script lang="ts">
	import { getDateAndTime, getDaysSince } from "$lib/helpers";
	import { AlertType } from "$lib/types/alerts";
	import { InformationCircle, XMark } from "svelte-heros-v2";

  export let dateString: string;
  export let type: AlertType;
  export let message: string;
</script>

{#if type === AlertType.LOW_INVENTORY}
<!-- Notification card -->
<div class="rounded-lg border border-warning flex flex-col w-full max-w-sm transition cursor-pointer overflow-hidden bg-gradient-to-r from-neutral to-yellow-900 hover:text-white hover:border-white">
  <div class="flex flex-row justify-between items-center gap-2 p-4">
    <InformationCircle size={'36px'} class="text-warning" />
    <div class="flex flex-col grow">
      <div class="font-thin">Below Threshold</div>
      <div class="font-light text-xs">{message}</div>
    </div>
    <button class="btn btn-square btn-sm btn-ghost text-neutral-content"><XMark /></button>
  </div>
  <div class="flex flex-row justify-between items-center bg-base-100 h-8 px-4">
    <div class="text-xs text-mono text-neutral-content">{getDateAndTime(dateString, true)}</div>
    <div class="text-xs text-mono text-neutral-content">{getDaysSince(dateString)}</div>
  </div>
</div>
{/if}

{#if type === AlertType.PRINTER_FAULT}
<!-- Notification card -->
<div class="rounded-lg border border-error flex flex-col w-full max-w-sm transition cursor-pointer overflow-hidden bg-gradient-to-r from-neutral to-red-900  hover:text-white hover:border-white">
  <div class="flex flex-row justify-between items-center gap-2 p-4">
    <InformationCircle size={'36px'} class="text-error" />
    <div class="flex flex-col grow">
      <div class="font-thin">Printer Failure</div>
      <div class="font-light text-xs">{message}</div>
    </div>
    <button class="btn btn-square btn-sm btn-ghost text-neutral-content"><XMark /></button>
  </div>
  <div class="flex flex-row justify-between items-center bg-base-100 h-8 px-4">
    <div class="text-xs text-mono text-neutral-content">{getDateAndTime(dateString, true)}</div>
    <div class="text-xs text-mono text-neutral-content">{getDaysSince(dateString)}</div>
  </div>
</div>
{/if}