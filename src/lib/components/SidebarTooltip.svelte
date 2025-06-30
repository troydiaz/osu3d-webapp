<script lang="ts">
  import { createFloatingActions } from 'svelte-floating-ui';
  import { offset } from '@floating-ui/dom';
  import { cubicInOut } from 'svelte/easing';
  import { fade, fly } from 'svelte/transition';

  export let activeRoute = false;
  let showTooltip = false;

  const [floatingRef, floatingContent] = createFloatingActions({
    strategy: 'absolute',
    placement: 'right',
    middleware: [offset(-0.25)]
  });
</script>

<div
  role="tooltip"
  use:floatingRef
  on:mouseenter={() => (showTooltip = true)}
  on:mouseleave={() => (showTooltip = false)}
>
  <slot />
</div>

{#if showTooltip}
  <div class="absolute pointer-events-none" use:floatingContent>
    <div
      class="pr-4 pl-1 py-1 rounded-r-md text-2xl font-extralight h-14 bg-gradient-to-b text-white {activeRoute
        ? 'from-blue-300 to-blue-400 dark:from-blue-400 dark:to-blue-500'
        : 'from-blue-300 to-blue-400 dark:from-blue-400 dark:to-blue-500'}"
    >
      <slot name="text" />
    </div>
  </div>
{/if}
