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

    export let data: PageData;
    const { session, machines, userLevel } = data;

    let tier1Machines: Machine[] = [];
    let selectedTier1Machine: Machine | null = null;
    let selectedTier1Time: number = 0;

    let tier2Machines: Machine[] = [];
    let selectedTier2Machine: Machine | null = null;
    let selectedTier2Time: number = 0;

    let newIssueModal: NewIssueModal;
    let newPrintModal: NewPrintModal;
    let cancelPrintModal: CancelPrintModal;

    setInterval(decrementTimers, 1000);

    function decrementTimers() {
        selectedTier1Time = selectedTier1Time > 0 ? selectedTier1Time - 1 : 0;
        selectedTier2Time = selectedTier2Time > 0 ? selectedTier2Time - 1 : 0;
    }

    function selectTier1Machine(machine: Machine) {
        selectedTier1Machine = machine;
        selectedTier1Time = getActivePrintJobTimeRemaining(machine);
    }

    function selectTier2Machine(machine: Machine) {
        selectedTier2Machine = machine;
        selectedTier2Time = getActivePrintJobTimeRemaining(machine);
    }

    function isTierCertified(tier: number) {
        if (!userLevel) return false;
        if (userLevel.level === -1) return true;
        return userLevel.level >= tier;
    }

    onMount(() => {
        tier1Machines.push(...machines?.filter(m => m.tier === 1) ?? []);

        if (tier1Machines.length > 0)
        selectedTier1Machine = tier1Machines[0];
        selectedTier1Time = getActivePrintJobTimeRemaining(selectedTier1Machine!);

        tier2Machines.push(...machines?.filter(m => m.tier === 2) ?? []);

        if (tier2Machines.length > 0)
        selectedTier2Machine = tier2Machines[0];
        selectedTier2Time = getActivePrintJobTimeRemaining(selectedTier2Machine!);

        console.log(machines);
    });
</script>

<svelte:head>
    <title>osu3d-webapp | dashboard</title>
</svelte:head>

{#if machines && selectedTier1Machine && selectedTier2Machine}
<div class="flex flex-col space-y-8">
    <!-- Tier 1 -->
    <div class="flex-row flex justify-start">
        <div class="prose">
            <h1 class="inline">Tier 1</h1>
        </div>
    </div>
    <div>
        <div class="tabs">
            {#each tier1Machines || [] as machine}
            <a class="tab tab-lifted tab-lg" class:tab-active="{selectedTier1Machine === machine}" on:click={() => selectTier1Machine(machine)}>
                {machine.nickname}
            </a>
            {/each}
        </div>
        <div class="rounded-b-lg border border-base-300 border-t-0 bg-base-100 shadow">
            <div class="flex flex-row justify-between p-4 pr-8">
                <div class="w-64">
                    <img src="{selectedTier1Machine.machine_def.model}.png" class="h-64">
                </div>
                <div class="flex flex-1 flex-col space-y-4">
                    <div class="stats shadow h-24 mt-4">
                        <div class="stat bg-base-200" class:bg-error-content={getMachineStatus(selectedTier1Machine) === MachineStatus.FAULT}>
                            <!-- <div class="stat-figure"><Bolt /></div> -->
                            <div class="stat-title w-24">Status</div>
                            <div class="stat-value font-mono text-2xl">{machineStatusToText(getMachineStatus(selectedTier1Machine))}</div>
                        </div>
                        <div class="stat bg-base-200" class:bg-error-content={getMachineStatus(selectedTier1Machine) === MachineStatus.FAULT}>
                            {#if getMachineStatus(selectedTier1Machine) === MachineStatus.PRINTING}
                            <div class="stat-title">Time Remaining</div>
                            <div class="stat-value">
                                <span class="countdown font-mono text-2xl">
                                    <span style:--value={Math.floor(selectedTier1Time / 60 / 60)}></span>h
                                    <span style:--value={Math.floor(selectedTier1Time / 60 % 60)}></span>m
                                    <span style:--value={Math.floor(selectedTier1Time % 60)}></span>s
                                </span>
                            </div>
                            {:else}
                            <div class="stat-title">Previous Job Finished</div>
                            <div class="stat-value font-mono text-2xl">{getLatestCompletePrintJob(selectedTier1Machine)}</div>
                            {/if}
                        </div>
                    </div>
                    {#if isTierCertified(1)}
                    <div class="flex flex-row space-x-4">
                        <button 
                            class="btn btn-accent flex-1" 
                            on:click={() => cancelPrintModal.launchModal(selectedTier1Machine)} 
                            disabled={getMachineStatus(selectedTier1Machine) !== MachineStatus.PRINTING || getMachineStatus(selectedTier1Machine) === MachineStatus.FAULT}
                        >
                            Cancel Print
                        </button>
                        <button
                            class="btn btn-error flex-1" 
                            on:click={() => newIssueModal.launchModal(selectedTier1Machine)}
                            disabled={getMachineStatus(selectedTier1Machine) === MachineStatus.FAULT}
                        >
                            Report Issue
                        </button>
                    </div>
                    <button 
                            class="btn btn-accent" 
                            on:click={() => newPrintModal.launchModal(selectedTier1Machine)} 
                            disabled={getMachineStatus(selectedTier1Machine) === MachineStatus.PRINTING || getMachineStatus(selectedTier1Machine) === MachineStatus.FAULT || !isTierCertified(1)}
                        >
                            Log Print
                    </button>
                    {:else}
                    <div class="flex flex-1">
                        <p class="mx-auto italic uppercase">Tier 1 certification required</p>
                    </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>

    <!-- Tier 2 -->
    <div class="flex-row flex justify-start">
        <div class="prose">
            <h1 class="inline">Tier 2</h1>
        </div>
    </div>
    <div>
        <div class="tabs">
            {#each tier2Machines || [] as machine}
            <a class="tab tab-lifted tab-lg" class:tab-active="{selectedTier2Machine === machine}" on:click={() => selectTier2Machine(machine)}>
                {machine.nickname}
            </a>
            {/each}
        </div>
        <div class="rounded-b-lg border border-base-300 border-t-0 bg-base-100 shadow">
            <div class="flex flex-row justify-between p-4 pr-8">
                <div class="w-64">
                    <img src="{selectedTier2Machine.machine_def.model}.png" class="h-64">
                </div>
                <div class="flex flex-1 flex-col space-y-4">
                    <div class="stats shadow mt-4">
                        <div class="stat bg-base-200" class:bg-error-content={getMachineStatus(selectedTier2Machine) === MachineStatus.FAULT}>
                            <!-- <div class="stat-figure"><Bolt /></div> -->
                            <div class="stat-title w-24">Status</div>
                            <div class="stat-value">
                                <span class="font-mono text-2xl">{machineStatusToText(getMachineStatus(selectedTier2Machine))}</span>
                            </div>
                        </div>
                        <div class="stat bg-base-200" class:bg-error-content={getMachineStatus(selectedTier2Machine) === MachineStatus.FAULT}>
                            {#if getMachineStatus(selectedTier2Machine) === MachineStatus.PRINTING}
                            <div class="stat-title">Time Remaining</div>
                            <div class="stat-value">
                                <span class="countdown font-mono text-2xl">
                                    <span style:--value={Math.floor(selectedTier2Time / 60 / 60)}></span>h
                                    <span style:--value={Math.floor(selectedTier2Time / 60 % 60)}></span>m
                                    <span style:--value={Math.floor(selectedTier2Time % 60)}></span>s
                                </span>
                            </div>
                            {:else}
                            <div class="stat-title">Previous Job Finished</div>
                            <div class="stat-value">
                                <span class="font-mono text-2xl">{getLatestCompletePrintJob(selectedTier2Machine)}</span>
                            </div>
                            {/if}
                        </div>
                    </div>
                    {#if isTierCertified(2)}
                    <div class="flex flex-row space-x-4">
                        <button 
                            class="btn btn-accent flex-1" 
                            on:click={() => cancelPrintModal.launchModal(selectedTier2Machine)} 
                            disabled={getMachineStatus(selectedTier2Machine) !== MachineStatus.PRINTING || getMachineStatus(selectedTier2Machine) === MachineStatus.FAULT}
                        >
                            Cancel Print
                        </button>
                        <button
                            class="btn btn-error flex-1" 
                            on:click={() => newIssueModal.launchModal(selectedTier2Machine)}
                            disabled={getMachineStatus(selectedTier2Machine) === MachineStatus.FAULT}
                        >
                            Report Issue
                        </button>
                    </div>
                    <button 
                            class="btn btn-accent" 
                            on:click={() => newPrintModal.launchModal(selectedTier2Machine)} 
                            disabled={getMachineStatus(selectedTier2Machine) === MachineStatus.PRINTING || getMachineStatus(selectedTier2Machine) === MachineStatus.FAULT}
                        >
                            Log Print
                    </button>  
                    {:else}
                    <div class="flex flex-1">
                        <p class="mx-auto italic uppercase">Tier 2 certification required</p>
                    </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>
{/if}


<NewIssueModal bind:this={newIssueModal} />
<NewPrintModal bind:this={newPrintModal} />
<CancelPrintModal bind:this={cancelPrintModal} />