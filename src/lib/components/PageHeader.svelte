<script lang="ts">
	import { ArrowLeft } from "svelte-heros-v2";

  export let image: string;
  export let name: string;
  export let backUrl: string | null = null;
</script>

<div class="relative overflow-hidden flex flex-row justify-between items-center bg-base-100 outline outline-1 outline-base-content/5 rounded-2xl p-8 shadow-lg">
  {#if backUrl}
    <a href={backUrl} class="btn btn-ghost btn-square uppercase text-xl font-light"><ArrowLeft size={'36px'} /></a>
  {/if}
  <div class="grow"></div>
  <div class="text-5xl font-thin pr-6 z-10">{ name }</div>
  <img src={image} class="absolute right-32 top-12 blur-[0.75px] scale-[4] w-16 h-16 opacity-10 pointer-events-none select-none" />
</div>