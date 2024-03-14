<script lang="ts">
	import { ArrowLeft } from "svelte-heros-v2";

  export let image: string;
  export let name: string;
  export let backUrl: string | null = null;
</script>

<div class="md:h-24 h-12 relative overflow-hidden flex flex-row justify-between items-center bg-base-100 border border-base-content/5 md:rounded-2xl p-8 gap-4">
  {#if backUrl}
    <a href={backUrl} class="btn btn-ghost btn-square uppercase text-xl font-light">
      <span class="md:hidden"><ArrowLeft size={'24px'} strokeWidth={'1px'} /></span>
      <span class="hidden md:inline"><ArrowLeft size={'36px'} strokeWidth={'1px'} /></span>
  </a>
  {/if}
  <div class="md:text-3xl text-xl font-thin pr-6 z-10">{ name }</div>
  <div class="grow"></div>
  <img src={image} alt="Page banner" class="hidden md:block absolute right-32 top-12 blur-[0.75px] scale-[4] w-16 h-16 opacity-25 pointer-events-none select-none" />
</div>