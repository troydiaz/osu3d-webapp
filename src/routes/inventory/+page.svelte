<script lang="ts">
  import type { PageData } from './$types';
  import { PencilSquare, Plus } from 'svelte-heros-v2';
  import InventoryTable from '$lib/components/tables/InventoryTable.svelte';
  import NewItemMenu from '$lib/components/menu/NewItemMenu.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import NewCategoryMenu from '$lib/components/menu/NewCategoryMenu.svelte';

  export let data: PageData;
  let { inventory, categories } = data;

  const FILAMENT_REGEX = /\b(pla\+?|pla|petg|tpu|abs|asa|nylon)\b/i;

  // Filament subset from full inventory
  $: filamentItems = (inventory ?? []).filter((i) => FILAMENT_REGEX.test(i.name.trim()));

  // Categories, excluding any named "Filament" (already rendered above)
  $: categoryList = (categories ?? []).filter((c) => c.name?.toLowerCase() !== 'filament');
</script>

<svelte:head>
  <title>Inventory | OSU 3D</title>
</svelte:head>

<div class="page">
  <PageHeader name="Inventory" />

  <div class="flex flex-row justify-end items-center gap-4">
    <a href="/inventory/tree" class="btn btn-secondary btn-sm">
      <PencilSquare /> Locations
    </a>
    <NewItemMenu {categories}>
      <button class="btn btn-primary btn-sm">
        <Plus /> Item
      </button>
    </NewItemMenu>
    <NewCategoryMenu>
      <button class="btn btn-primary btn-sm">
        <Plus /> Category
      </button>
    </NewCategoryMenu>
  </div>

  <!-- Filament section -->
  <InventoryTable title="Filament" inventory={filamentItems} allowSearch={true} />

  <!-- All Items section -->
  <InventoryTable title="All Items" inventory={inventory ?? []} allowSearch={true} />

  <!-- Other categories (Filament excluded), each with search -->
  {#each categoryList as category (category.id)}
    <InventoryTable
      title={category.name}
      inventory={(inventory ?? []).filter((i) => i.inv_category_id === category.id)}
      allowSearch={true}
    />
  {/each}
</div>
