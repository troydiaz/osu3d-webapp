<script lang="ts">
	import { createFloatingActions } from "svelte-floating-ui";
	import { offset } from "svelte-floating-ui/core";
	import { fly } from "svelte/transition";

  export let activeRoute = false;
  let showTooltip = false;

  const [floatingRef, floatingContent] = createFloatingActions({
    strategy: 'absolute',
    placement: 'right',
    middleware: [
      offset(0)
    ]
  });
</script>

<div role="tooltip" use:floatingRef on:mouseenter={() => showTooltip = true} on:mouseleave={() => showTooltip = false}>
  <slot />
</div>

{#if showTooltip}
<div class="absolute -translate-x-0.5 pointer-events-none" use:floatingContent>
  <div class=" px-4 py-1 rounded-r-md text-2xl h-[58px] transition bg-gradient-to-b font-light text-white {activeRoute ? 'from-blue-300 to-blue-400 dark:from-blue-400 dark:to-blue-500' : 'from-blue-300 to-blue-400 dark:from-blue-400 dark:to-blue-500'}" transition:fly={{ x: -5, duration: 100}}><slot name="text" /></div>
</div>
{/if}