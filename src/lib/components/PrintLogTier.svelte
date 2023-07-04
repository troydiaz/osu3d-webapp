<script lang="ts">
	import { getMachineStatus, type Fault, type Machine, machineStatusToText, MachineStatus, getLatestCompletePrintJob, getActivePrintJobTimeRemaining, type UserLevel, getMachineStatusColor } from "$lib/types/database";
	import NewIssueModal from "./modals/NewIssueModal.svelte";
    import NewPrintModal from "./modals/NewPrintModal.svelte";
    import CancelPrintModal from "./modals/CancelPrintModal.svelte";
	import { Wrench } from "svelte-heros-v2";
	import { onMount } from "svelte";

    export let userLevel: UserLevel;
    export let machines: Machine[];
    export let tier: number;

    let selectedMachine: Machine;
    let selectedMachineTime = 0;

    let newIssueModal: NewIssueModal;
    let newPrintModal: NewPrintModal;
    let cancelPrintModal: CancelPrintModal;

    function isTierCertified(tier: number) {
        if (!userLevel) return false;
        if (userLevel.level === -1) return true;
        return userLevel.level >= tier;
    }

    function decrementTimers() {
        selectedMachineTime = selectedMachineTime > 0 ? selectedMachineTime - 1 : 0;
    }

    $: selectMachineTab(machines[0]);

    setInterval(decrementTimers, 1000);

    function selectMachineTab(machine: Machine) {
        selectedMachine = machine;
        selectedMachineTime = getActivePrintJobTimeRemaining(machine);
    }
</script>



<div class="flex flex-col gap-4">
    <!-- Header -->
    <div class="flex flex-row justify-between items-center">
        <div class="font-thin text-3xl">Tier {tier} Printers</div>
        <!-- <div class="divider divider-horizontal"></div> -->
        <div class="flex flex-row">
            <div class="font-light mr-2">Legend</div>
            <div class="bg-neutral-content text-neutral text-xs font-mono rounded rounded-r-none uppercase px-2 py-1">Idle</div>
            <div class="bg-info text-info-content text-xs font-mono uppercase px-2 py-1">Printing</div>
            <div class="bg-warning text-warning-content text-xs font-mono rounded rounded-l-none uppercase px-2 py-1">Fault</div>
        </div>
        <!-- <span>{machines.filter(m => getMachineStatus(m) === MachineStatus.IDLE).length} ready of {machines.length} total</span> -->
    </div>


    <div>
        <div class="tabs border-none justify-between">
            {#each machines as machine}
            <a class="rounded-t-2xl tab my-tab-lifted tab-lg border-none grow {selectedMachine === machine ? 'tab-active !bg-neutral' : ''} {getMachineStatusColor(machine)}" on:click={() => selectMachineTab(machine)}>
                {machine.nickname}
            </a>
            {/each}
        </div>
        <div class="rounded-b-2xl bg-neutral shadow-lg p-12 relative overflow-hidden"
            class:rounded-tl-2xl={machines.indexOf(selectedMachine) !== 0}
            class:rounded-tr-2xl={machines.indexOf(selectedMachine) !== machines.length - 1}
        >
            <div class="flex flex-row justify-between">
                <div class="flex flex-col justify-start space-y-2 z-10">
                    <span class="text-5xl font-thin">{selectedMachine.nickname}</span>
                    <span class="text-2xl grow">{selectedMachine.machine_def.make} {selectedMachine.machine_def.model}</span>
                </div>
                {#if userLevel.level === -1}
                    <button class="btn btn-ghost justify-start items-center grow"><Wrench size={'32px'} variation={'solid'} /></button>
                {/if}
                <img src="{selectedMachine.machine_def.model}.png" class="w-1/2 absolute blur opacity-50 left-16">
                <div class="flex flex-col justify-start space-y-4 z-10 p-4 h-72 rounded-2xl bg-base-100 bg-opacity-75 backdrop-blur">
                    <div class="stats shadow h-24 bg-base-200 bg-opacity-50 backdrop-blur">
                        <div class="stat" class:bg-error-content={getMachineStatus(selectedMachine) === MachineStatus.FAULT}>
                            <!-- <div class="stat-figure"><Bolt /></div> -->
                            <div class="stat-title w-24">Status</div>
                            <div class="stat-value font-mono text-2xl">{machineStatusToText(getMachineStatus(selectedMachine))}</div>
                        </div>
                        <div class="stat" class:bg-error-content={getMachineStatus(selectedMachine) === MachineStatus.FAULT}>
                            {#if getMachineStatus(selectedMachine) === MachineStatus.PRINTING}
                            <div class="stat-title">Time Remaining</div>
                            <div class="stat-value">
                                <span class="countdown font-mono text-2xl">
                                    <span style:--value={Math.floor(selectedMachineTime / 60 / 60)}></span>h
                                    <span style:--value={Math.floor(selectedMachineTime / 60 % 60)}></span>m
                                    <span style:--value={Math.floor(selectedMachineTime % 60)}></span>s
                                </span>
                            </div>
                            {:else}
                            <div class="stat-title">Previous Job Finished</div>
                            <div class="stat-value font-mono text-2xl">{getLatestCompletePrintJob(selectedMachine)}</div>
                            {/if}
                        </div>
                    </div>
                    <div class="divider"></div>
                    {#if isTierCertified(tier)}
                    <div class="flex flex-row space-x-4">
                        <button
                            class="btn btn-accent flex-1"
                            on:click={() => cancelPrintModal.launchModal(selectedMachine)}
                            disabled={getMachineStatus(selectedMachine) !== MachineStatus.PRINTING || getMachineStatus(selectedMachine) === MachineStatus.FAULT}
                        >
                            Cancel Print
                        </button>
                        <button
                            class="btn btn-error flex-1"
                            on:click={() => newIssueModal.launchModal(selectedMachine)}
                            disabled={getMachineStatus(selectedMachine) === MachineStatus.FAULT}
                        >
                            Report Issue
                        </button>
                    </div>
                    <button
                            class="btn btn-accent"
                            on:click={() => newPrintModal.launchModal(selectedMachine)}
                            disabled={getMachineStatus(selectedMachine) === MachineStatus.PRINTING || getMachineStatus(selectedMachine) === MachineStatus.FAULT || !isTierCertified(1)}
                        >
                            Log Print
                    </button>
                    {:else}
                    <div class="grow"></div>
                    <p class="self-center uppercase text-center">Tier {tier} cert required to<br>log a print for this machine</p>
                    <div class="grow"></div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

<NewIssueModal bind:this={newIssueModal} />
<NewPrintModal bind:this={newPrintModal} />
<CancelPrintModal bind:this={cancelPrintModal} />

<style>
    .my-tab-lifted::after, .my-tab-lifted::before {
        background-image: radial-gradient(circle at var(--circle-pos), transparent var(--tab-grad), transparent calc(var(--tab-grad) + 0.3px), transparent calc(var(--tab-grad) + var(--tab-border, 1px)), var(--tab-bg) calc(var(--tab-grad) + var(--tab-border, 1px) + 0.3px)) !important;
    }

    .my-tab-lifted:first-of-type::before {
        background-image: none !important;
    }

    .my-tab-lifted:last-of-type::after {
        background-image: none !important;
    }
</style>