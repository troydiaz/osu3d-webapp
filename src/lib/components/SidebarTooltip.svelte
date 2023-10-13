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

<div use:floatingRef on:mouseenter={() => showTooltip = true} on:mouseleave={() => showTooltip = false}>
  <slot />
</div>

{#if showTooltip}
<div class="absolute border border-base-content/5 border-l-0 -translate-x-0.5" use:floatingContent>
  <div class="pointer-events-none px-4 py-1 rounded-r-lg text-2xl h-[56px] transition bg-gradient-to-b font-light text-black dark:text-blue-50 {activeRoute ? 'from-blue-300 to-blue-400 dark:from-blue-400 dark:to-blue-500' : 'from-blue-300 to-blue-400 dark:from-blue-400 dark:to-blue-500'}" transition:fly={{ x: -15, duration: 150}}><slot name="text" /></div>
</div>
{/if}