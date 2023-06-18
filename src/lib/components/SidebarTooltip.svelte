<script lang="ts">
	import { createFloatingActions } from "svelte-floating-ui";
	import { flip, offset, shift } from "svelte-floating-ui/core";
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
<div class="absolute" use:floatingContent>
  <div class="pointer-events-none px-4 py-1 rounded-r-lg text-2xl h-[56px] transition {activeRoute ? 'bg-info text-info-content' : 'bg-base-100'}" transition:fly={{ x: -15, duration: 150}}><slot name="text" /></div>
</div>
{/if}