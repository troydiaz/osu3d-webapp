<script lang="ts">
	import { ArrowLeft } from "svelte-heros-v2";

  export let image: string | null = null;
  export let name: string;
  export let backUrl: string | null = null;
</script>

<div class="h-24 relative overflow-hidden flex md:flex-row items-center gap-4 p-4">
  {#if backUrl}
    <a href={backUrl} class="btn btn-ghost btn-square uppercase text-xl font-light">
      <span class="md:hidden"><ArrowLeft size={'32px'} strokeWidth={'1px'} /></span>
      <span class="hidden md:inline"><ArrowLeft size={'36px'} strokeWidth={'1px'} /></span>
  </a>
  {/if}

  <div class="flex w-full h-full">
    <div class="grow hidden md:inline w-fit text-3xl md:font-thin z-10">{ name }</div>
    <div class="grow md:hidden text-xl z-10 flex items-center w-full h-full gap-2">
    
    
      <img src="/osu3d.svg" alt="Club logo" class="h-10 w-10 opacity-75" />
      <div class="text-2xl font-thin">osu3d.io </div>
      <div class="grow" />
      <div class="text-2xl font-thin">{name}</div>
    </div>
  </div>

  {#if image}
    <div class="grow"></div>
    <img src={image} alt="Page banner" class="hidden md:block absolute right-32 top-12 blur-[0.75px] scale-[4] w-16 h-16 opacity-25 pointer-events-none select-none" />
  {/if}
</div>