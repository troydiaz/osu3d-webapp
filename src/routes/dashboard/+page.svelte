<script lang="ts">
	import { onMount } from "svelte";
	import type { PageData } from "./$types";
	import { fade, scale } from "svelte/transition";
	import NewIssueModal from "$lib/components/modals/NewIssueModal.svelte";
	import { machineStatusToText, type Fault, type Machine, getMachineStatus, getLatestCompletePrintJob, type HMS, getActivePrintJobTimeRemaining } from "$lib/types/database";
	import NewPrintModal from "$lib/components/modals/NewPrintModal.svelte";
	import { Bolt, Check } from "svelte-heros-v2";
	import { MachineStatus } from "$lib/types/database";
	import CancelPrintModal from "$lib/components/modals/CancelPrintModal.svelte";
	import PrintLogTier from "$lib/components/PrintLogTier.svelte";

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
    });
</script>

<svelte:head>
    <title>osu3d-webapp | dashboard</title>
</svelte:head>

{#if machines && userLevel }
<div class="flex flex-col space-y-8 lg:my-16 w-full">
    <div class="relative overflow-hidden flex flex-row justify-between bg-base-100 rounded-lg p-12 shadow-lg">
        <div class="flex flex-col justify-between items-start space-y-12">
            <div class="flex flex-col space-y-2">
                <span class="text-5xl font-bold">Dashboard</span>
                <span class="text-2xl italic">Start a print or report an issue</span>
            </div>
            
        </div>
        <img src="/safety-man.png" class="absolute right-0 -top-8 blur-sm">
    </div>
    <div class="divider"></div>
    <PrintLogTier machines={machines.filter(m => m.tier === 1)} tier={1} userLevel={userLevel} />
    <div class="divider"></div>
    <PrintLogTier machines={machines.filter(m => m.tier === 2)} tier={2} userLevel={userLevel} />
</div>
{/if}