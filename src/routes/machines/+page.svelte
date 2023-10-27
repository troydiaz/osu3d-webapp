<script lang="ts">
	import type { PageData } from "./$types";
  import MachineTable from "$lib/components/tables/MachineTable.svelte";
	import PageHeader from "$lib/components/PageHeader.svelte";
  import printer from '$lib/images/printer.png';

  export let data: PageData;
  let { machines } = data;
</script>

<svelte:head>
    <title>Printers | OSU 3D</title>
</svelte:head>

<div class="flex flex-col gap-12 w-full">
    <PageHeader name="Printers" image={printer} />
    
    {#if machines}
    <MachineTable machines={machines.filter(m => m.tier === 1)} tier={1} />
    <MachineTable machines={machines.filter(m => m.tier === 2)} tier={2} />
    <MachineTable machines={machines.filter(m => m.tier === 3)} tier={3} />
    {/if}
</div>