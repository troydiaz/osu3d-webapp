<script lang="ts">
	import { onMount } from "svelte";
	import type { PageData } from "./$types";
	import { type Machine, getActivePrintJobTimeRemaining } from "$lib/types/database";
	import PrintLogTier from "$lib/components/PrintLogTier.svelte";
	import { InformationCircle, RocketLaunch } from "svelte-heros-v2";
	import { AlertTypeOld, addAlert } from "$lib/stores/alerts";
	import { size } from "svelte-floating-ui/core";

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
    <title>Dashboard</title>
</svelte:head>

{#if machines && userLevel }
<div class="flex flex-col gap-12 lg:my-12 w-full">
    <div class="relative overflow-hidden flex flex-row justify-between items-center bg-neutral rounded-2xl p-8 shadow-lg">
        <div class="flex flex-row gap-4 items-center">
            <div class="text-3xl font-thin">Hello</div>
            <div class="text-2xl font-mono bg-base-100 px-2 rounded-xl py-1">{session.user.email}</div>
        </div>
        <div class="grow"></div>
        <div class="text-5xl font-thin pr-6">Dashboard</div>
        <RocketLaunch size={'64px'} strokeWidth={'1px'} />
    </div>
    <PrintLogTier machines={machines.filter(m => m.tier === 1)} tier={1} userLevel={userLevel[0]} />
    <PrintLogTier machines={machines.filter(m => m.tier === 2)} tier={2} userLevel={userLevel[0]} />
</div>
{/if}