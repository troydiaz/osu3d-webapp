<script lang="ts">
	import { ArrowLeft } from "svelte-heros-v2";

  export let image: string;
  export let name: string;
  export let backUrl: string | null = null;
</script>

<div class="h-24 relative overflow-hidden flex flex-row justify-between items-center bg-base-100 border border-base-content/10 md:rounded-2xl p-8 md:shadow-lg">
  {#if backUrl}
    <a href={backUrl} class="btn btn-ghost btn-square uppercase text-xl font-light">
      <span class="md:hidden"><ArrowLeft size={'24px'} /></span>
      <span class="hidden md:inline"><ArrowLeft size={'36px'} /></span>
  </a>
  {/if}
  <div class="grow"></div>
  <div class="lg:text-5xl text-3xl font-thin pr-6 z-10">{ name }</div>
  <img src={image} class="absolute right-32 top-12 blur-[0.75px] scale-[4] w-16 h-16 opacity-25 pointer-events-none select-none" />
</div>