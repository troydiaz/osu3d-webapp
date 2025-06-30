<script lang="ts">
	import type { InventoryCategory } from "$lib/types/models";
	import { arrow, createFloatingActions } from "svelte-floating-ui";
	import { offset, shift } from "svelte-floating-ui/core";
	import { writable } from "svelte/store";
	import { fade, fly } from "svelte/transition";

  let showTooltip = false;
  export let categories: InventoryCategory[] = [];

  const arrowRef = writable<HTMLElement>();

  const [floatingRef, floatingContent] = createFloatingActions({
    strategy: 'absolute',
    placement: 'bottom',
    middleware: [
      offset({ crossAxis: 25, mainAxis: 15 }),
      arrow({ element: arrowRef })
    ],
    onComputed({ placement, middlewareData }) {
      const { x, y } = middlewareData.arrow!;
      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right'
      }[placement.split('-')[0]];

      Object.assign($arrowRef.style, {
        left: x != null ? `${x}px` : '',
        top: y != null ? `${y}px` : '',
        [staticSide!]: '-25px'
      });
    }
  });
</script>

<div role="menu" tabindex="0" use:floatingRef on:click={() => showTooltip = !showTooltip} on:keydown={e => (e.key === 'Enter' || e.key === ' ') && (showTooltip = !showTooltip)} class="{showTooltip ? 'z-20' : ''}"><slot /></div>

{#if showTooltip}
<div class="absolute w-80 z-20" use:floatingContent>
  <div class="w-full rounded-2xl bg-primary p-4 transition flex flex-col gap-2" transition:fly={{ y: 25, duration: 200 }}>

    <!-- Arrow -->
    <div class="absolute fill-primary" bind:this={$arrowRef}>
      <svg viewBox="0 0 20 20" width="25" height="25">
        <path stroke="none" d="M0 20C0 20 2.06906 19.9829 5.91817 15.4092C7.49986 13.5236 8.97939 12.3809 10.0002 12.3809C11.0202 12.3809 12.481 13.6451 14.0814 15.5472C17.952 20.1437 20 20 20 20H0Z"></path>
      </svg>
    </div>

    <form
      id="submit-new-item"
			method="post"
			action="?/submitNewItem" />

    <!-- New Item Dialog -->
    <div class="text-xl text-bold text-primary-content text-center font-thin">Create New Inventory Item</div>

    <!-- Category -->
    <div class="form-control w-full max-w-xs">
      <label for="inv_category_id" class="label"><span class="label-text text-primary-content font-light">Category</span></label>
      <select form="submit-new-item" name="inv_category_id" class="select">
        {#each categories as category}
        <option value={category.id}>{category.name}</option>
        {/each}
      </select>
    </div>

    <!-- Name -->
    <div class="form-control w-full max-w-xs">
      <label for="name" class="label"><span class="label-text text-primary-content font-light">Name</span></label>
      <input form="submit-new-item" type="text" name="name" class="input font-light" />
    </div>

    <!-- Description -->
    <!-- <div class="form-control w-full max-w-xs">
      <label for="description" class="label"><span class="label-text text-primary-content font-light">Description (optional)</span></label>
      <textarea name="description" class="input" />
    </div> -->

    <div class="form-control w-full max-w-xs">
      <label for="minimum" class="label"><span class="label-text text-primary-content font-light">Min. threshold (optional)</span></label>
      <input form="submit-new-item" type="number" name="minimum" class="input font-light" />
    </div>

    <div class="flex flex-row justify-end gap-4 mt-4">
      <button class="btn btn-sm btn-ghost text-primary-content font-light" form="submit-new-item" type="submit">Submit</button>
      <button class="btn btn-sm btn-ghost text-error font-light" on:click={() => showTooltip = false}>Cancel</button>
    </div>
  </div>
</div>

<button class="fixed w-screen h-screen top-0 left-0 bg-neutral-900/50 z-10" transition:fade={{ duration: 200 }} on:click={() => showTooltip = false}></button>
{/if}

