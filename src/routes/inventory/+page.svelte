
<script lang="ts">
	import type { PageData } from "./$types";
	import { ArrowLeft, CubeTransparent, Plus } from "svelte-heros-v2";
	import InventoryTable from "$lib/components/tables/InventoryTable.svelte";
	import NewItemMenu from "$lib/components/menu/NewItemMenu.svelte";

    export let data: PageData;
    let { session, inventory, categories } = data;

    $: console.log(inventory);
</script>

<svelte:head>
    <title>Inventory</title>
</svelte:head>

<div class="flex flex-col gap-12 lg:my-12 w-full">
    <div class="relative overflow-hidden flex flex-row justify-between items-center bg-neutral rounded-2xl p-8 shadow-lg">
        <a href="/dashboard" class="btn btn-outline uppercase text-xl font-light"><ArrowLeft class="inline" strokeWidth={'2px'} /><span class="ml-4 align-middle">Dashboard</span></a>
        <div class="grow"></div>
        <span class="text-5xl font-thin pr-6">Club Inventory</span>
        <CubeTransparent size={'64px'} strokeWidth={'1px'} />
    </div>
    <div class="flex flex-row justify-end items-center gap-4">
        <NewItemMenu><button class="btn btn-primary btn-sm"><Plus /> New Item</button></NewItemMenu>
        <button class="btn btn-primary btn-sm"><Plus /> New Category</button>
    </div>
    <InventoryTable title={'All Items'} inventory={inventory || []} categories={categories} allowSearch={true} />
    <InventoryTable title={'Filament'} inventory={inventory.filter(i => i.inv_category.name === 'Filament')} categories={categories} />
    <InventoryTable title={'Spare Parts'} inventory={inventory.filter(i => i.inv_category.name === 'Spare Parts')} categories={categories} />
</div>