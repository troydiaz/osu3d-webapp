<script lang="ts">
  import type { PageData } from './$types';
  import { Pencil, PencilSquare, Plus } from 'svelte-heros-v2';
  import InventoryTable from '$lib/components/tables/InventoryTable.svelte';
  import NewItemMenu from '$lib/components/menu/NewItemMenu.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import box from '$lib/images/package.png';
  import NewCategoryMenu from '$lib/components/menu/NewCategoryMenu.svelte';

  export let data: PageData;
  let { inventory, categories } = data;
</script>

<svelte:head>
  <title>Inventory | OSU 3D</title>
</svelte:head>

<div class="page">
  <PageHeader name="Inventory" />
  <div class="flex flex-row justify-end items-center gap-4">
    <a href="/inventory/tree" class="btn btn-secondary btn-sm"><PencilSquare /> Locations</a>
    <NewItemMenu {categories}><button class="btn btn-primary btn-sm"><Plus /> Item</button></NewItemMenu>
    <NewCategoryMenu><button class="btn btn-primary btn-sm"><Plus /> Category</button></NewCategoryMenu>
  </div>
  <InventoryTable
    title="Filament"
    inventory={inventory.filter((i) =>
      /\b(pla\+?|pla|petg|tpu|abs|asa|nylon)\b/i.test(i.name.trim())
    )}
    allowSearch={true}
  />
  <InventoryTable title={'All Items'} inventory={inventory || []} allowSearch={true} />
  {#each categories || [] as category}
    <InventoryTable title={category.name} inventory={inventory.filter((i) => i.inv_category_id === category.id)} />
  {/each}
</div>
