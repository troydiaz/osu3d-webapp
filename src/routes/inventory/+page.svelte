
<script lang="ts">
	import type { PageData } from "./$types";
	import { Plus } from "svelte-heros-v2";
	import InventoryTable from "$lib/components/tables/InventoryTable.svelte";
	import NewItemMenu from "$lib/components/menu/NewItemMenu.svelte";
	import PageHeader from "$lib/components/PageHeader.svelte";
    import box from '$lib/images/package.png';

    export let data: PageData;
    let { inventory, categories } = data;
</script>

<svelte:head>
    <title>Inventory | OSU 3D</title>
</svelte:head>

<div class="flex flex-col gap-12 w-full">
    <PageHeader name="Inventory" image={box} />
    <div class="flex flex-row justify-end items-center gap-4">
        <NewItemMenu categories={categories}><button class="btn btn-primary btn-sm"><Plus /> New Item</button></NewItemMenu>
        <button class="btn btn-primary btn-sm" disabled><Plus /> New Category</button>
    </div>
    <InventoryTable title={'All Items'} inventory={inventory || []} allowSearch={true} />
    {#each categories || [] as category}
    <InventoryTable title={category.name} inventory={inventory.filter(i => i.inv_category_id === category.id)} />
    {/each}
</div>