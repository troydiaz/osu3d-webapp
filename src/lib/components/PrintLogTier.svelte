<script lang="ts">
	import { getMachineStatus, type Fault, type Machine, machineStatusToText, MachineStatus, getLatestCompletePrintJob, getActivePrintJobTimeRemaining, type UserLevel } from "$lib/types/database";
	import NewIssueModal from "./modals/NewIssueModal.svelte";
    import NewPrintModal from "./modals/NewPrintModal.svelte";
    import CancelPrintModal from "./modals/CancelPrintModal.svelte";
	import { Wrench } from "svelte-heros-v2";

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

    setInterval(decrementTimers, 1000);

    $: if (machines) {
        selectedMachine = machines[0];
    }

    function selectMachineTab(machine: Machine) {
        selectedMachine = machine;
        selectedMachineTime = getActivePrintJobTimeRemaining(machine);
    }
</script>

<div class="flex flex-row justify-start items-center">
    <div class="prose"><h2>Tier {tier}</h2></div>
    <div class="divider divider-horizontal"></div>
    <span>{machines.filter(m => getMachineStatus(m) === MachineStatus.IDLE).length} ready of {machines.length} total</span>
</div>
<div>
    <div class="tabs border-none justify-between">
        {#each machines as machine}
        <a class="tab tab-lifted my-tab-lifted tab-lg border-none grow" class:tab-active="{selectedMachine === machine}" on:click={() => selectMachineTab(machine)}>
            {machine.nickname}
        </a>
        {/each}
    </div>
    <div class="rounded-b-lg bg-base-100 shadow-lg p-12 relative overflow-hidden" 
        class:rounded-tl-lg={machines.indexOf(selectedMachine) !== 0}
        class:rounded-tr-lg={machines.indexOf(selectedMachine) !== machines.length - 1}
    >
        <div class="flex flex-row justify-between">
            <div class="flex flex-col justify-start space-y-2 z-10">
                <span class="text-5xl font-bold">{selectedMachine.nickname}</span>
                <span class="text-2xl grow">{selectedMachine.machine_def.make} {selectedMachine.machine_def.model}</span>
                {#if userLevel.level === -1}
                <button class="btn btn-ghost self-start"><Wrench size={'32px'} variation={'solid'} /></button>
                {/if}
            </div>
            <img src="{selectedMachine.machine_def.model}.png" class="w-1/2 absolute blur opacity-50 right-1/4">
            <div class="flex flex-col justify-start space-y-4 z-10 p-4 h-72 rounded-lg bg-base-100 bg-opacity-75 backdrop-blur">
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