<script lang="ts">
	import type { Database } from "$lib/types/supabase.js";
	import { onMount } from "svelte";
	import type { LayoutData } from "../$types.js";


    export let data: LayoutData;

    let loadedMachines: any[] = [];
    
    async function loadMachines() {
        const machines = await data.supabase.from('machines').select('*');
        loadedMachines = machines.data ?? [];

        console.log(loadedMachines);
    }

    $: if (data.session) {
        loadMachines();
        console.log(data);
    }

    let currentTab = 1;

    function changeTab(newTab: number) {
        currentTab = newTab;
    }
</script>

<div class="flex flex-col justify-center w-full">
    <div class="p-8 mx-auto rounded-lg w-2/3">
        <div class="tabs">
            <a class="tab tab-lg tab-lifted" class:tab-active="{currentTab === 1}" on:click={() => changeTab(1)}>Ironman</a>
            <a class="tab tab-lg tab-lifted" class:tab-active="{currentTab === 2}" on:click={() => changeTab(2)}>Thor</a>
            <a class="tab tab-lg tab-lifted" class:tab-active="{currentTab === 3}" on:click={() => changeTab(3)}>Spiderman</a>
            <a class="tab tab-lg tab-lifted" class:tab-active="{currentTab === 4}" on:click={() => changeTab(4)}>Bruce Banner</a>
            <a class="tab tab-lg tab-lifted" class:tab-active="{currentTab === 5}" on:click={() => changeTab(5)}>Doctor Strange</a>
            <a class="tab tab-lg tab-lifted" class:tab-active="{currentTab === 6}" on:click={() => changeTab(6)}>Loki</a>
            <a class="tab tab-lg tab-lifted" class:tab-active="{currentTab === 7}" on:click={() => changeTab(7)}>Wanda</a>
        </div>
        <div class="h-64 rounded-b-lg rounded-tr-lg border bg-base-100/75">
            {#if data.session}
            {#each loadedMachines as machine}
                <h2>{machine.name}</h2>
            {/each}
            {/if}
        </div>
    </div>
</div>