<script lang="ts">
	import { onMount } from "svelte";
	import type { PageData } from "./$types";
	import { type Machine, getActivePrintJobTimeRemaining } from "$lib/types/database";
	import PrintLogTier from "$lib/components/PrintLogTier.svelte";
	import { RocketLaunch } from "svelte-heros-v2";
    import rocket from '$lib/images/rocket.png';
	
    export let data: PageData;
    const { session, machines, userLevel } = data;

    let tier1Machines: Machine[] = [];
    let selectedTier1Machine: Machine | null = null;
    let selectedTier1Time: number = 0;

    let tier2Machines: Machine[] = [];
    let selectedTier2Machine: Machine | null = null;
    let selectedTier2Time: number = 0;

    onMount(() => {
        tier1Machines.push(...machines?.filter(m => m.tier === 1) ?? []);

        if (tier1Machines.length > 0)
        selectedTier1Machine = tier1Machines[0];
        selectedTier1Time = getActivePrintJobTimeRemaining(selectedTier1Machine!);

        tier2Machines.push(...machines?.filter(m => m.tier === 2) ?? []);

        if (tier2Machines.length > 0)
        selectedTier2Machine = tier2Machines[0];
        selectedTier2Time = getActivePrintJobTimeRemaining(selectedTier2Machine!);

        // addAlert(AlertType.URGENT, 'Discord Reminder!', 'Add your username to your account settings to get automated pings about your prints!')
    });
</script>

<svelte:head>
    <title>Dashboard | OSU 3D</title>
</svelte:head>

{#if machines && userLevel }
<div class="flex flex-col gap-12 lg:py-12 w-full">
    <div class="relative overflow-hidden flex flex-row justify-between bg-base-100 outline outline-1 outline-base-content/10 items-center md:rounded-2xl p-8 md:shadow-lg">
        <div class="flex-row gap-4 items-center hidden md:flex">
            <div class="text-3xl font-thin">Hello</div>
            <div class="text-2xl font-mono bg-base-200 px-2 rounded-xl py-1 outline outline-1 outline-base-content/20 text-gray-500">{session.user.email}</div>
        </div>
        <div class="grow"></div>
        <div class="lg:text-5xl text-3xl font-thin z-10">Dashboard</div>
        <img src={rocket} class="absolute right-32 top-12 blur-[1px] scale-[5] w-16 h-16 opacity-25 pointer-events-none select-none" />
    </div>
    <PrintLogTier machines={machines.filter(m => m.tier === 1)} tier={1} userLevel={userLevel} />
    <PrintLogTier machines={machines.filter(m => m.tier === 2)} tier={2} userLevel={userLevel} />
</div>
{/if}