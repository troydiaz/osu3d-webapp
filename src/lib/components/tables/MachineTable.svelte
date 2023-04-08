<script lang="ts">
	import { goto } from "$app/navigation";
	import { getMachineStatus, type Fault, type Machine, machineStatusToText, MachineStatus, getLatestCompletePrintJob } from "$lib/types/database";
	import Paginate from "$lib/utilities/Paginate.svelte";
	import { ExclamationCircle } from "svelte-heros-v2";

    export let machines: Machine[] = [];
    export let tier: number;

    let lowerIndex: number = 0;
    let upperIndex: number = 0;
</script>

<!-- Machines table -->
<div class="flex flex-col space-y-4">
    <div class="flex flex-row justify-start items-center">
        <div class="prose"><h2>Tier {tier} Machines</h2></div>
        <div class="divider divider-horizontal"></div>
        <div class="grow">{machines.length} Entries Total</div>
        <Paginate totalRows={machines.length} bind:lowerIndex bind:upperIndex />
    </div>
    
    <table class="table table-compact shadow-lg">
        <thead>
            <tr>
                <th>Status</th>
                <th>Nickname</th>
                <th>Type</th>
                <th>Lastest Job</th>
            </tr>
        </thead>
        <tbody>
            {#each machines || [] as machine}
            <tr class="hover cursor-pointer" on:click={() => goto(`/machines/${machine.id}`)} class:table-row-error={getMachineStatus(machine) === MachineStatus.FAULT}>
                <td>
                    {#if getMachineStatus(machine) === MachineStatus.FAULT}
                    <ExclamationCircle />
                    {:else}
                    {machineStatusToText(getMachineStatus(machine))}
                    {/if}
                </td>
                <td>{machine.nickname}</td>
                <td>{machine.machine_def.make} {machine.machine_def.model}</td>
                <td>{getLatestCompletePrintJob(machine)}</td>
                <!-- <td>
                    <button class="btn btn-square btn-ghost focus:outline-none">
                        <Bars3></Bars3>
                    </button>
                </td> -->
            </tr>
            {/each}
        </tbody>
    </table>
</div>