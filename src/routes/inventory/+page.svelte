
<script lang="ts">
	import type { PageData } from "./$types";
	import { ArrowLeft, CubeTransparent, Plus } from "svelte-heros-v2";
	import InventoryTable from "$lib/components/tables/InventoryTable.svelte";
	import NewItemMenu from "$lib/components/menu/NewItemMenu.svelte";
	import PageHeader from "$lib/components/PageHeader.svelte";
    import box from '$lib/images/package.png';

    export let data: PageData;
    let { session, inventory, categories } = data;
</script>

<svelte:head>
    <title>Inventory</title>
</svelte:head>

<div class="flex flex-col gap-12 lg:my-12 w-full">
    <PageHeader name="Club Inventory" image={box} />
    <div class="flex flex-row justify-end items-center gap-4">
        <NewItemMenu categories={categories}><button class="btn btn-primary btn-sm"><Plus /> New Item</button></NewItemMenu>
        <button class="btn btn-primary btn-sm"><Plus /> New Category</button>
    </div>
    <InventoryTable title={'All Items'} inventory={inventory || []} categories={categories} allowSearch={true} />
    <InventoryTable title={'Filament'} inventory={inventory.filter(i => i.inv_category.name === 'Filament')} categories={categories} />
    <InventoryTable title={'Spare Parts'} inventory={inventory.filter(i => i.inv_category.name === 'Spare Parts')} categories={categories} />
</div>