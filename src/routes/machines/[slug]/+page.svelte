<script lang="ts">
	import type { ActionData, PageData, PageServerData } from './$types';
	import FaultTable from '$lib/components/tables/FaultTable.svelte';
	import PrintLogTable from '$lib/components/tables/PrintLogTable.svelte';
	import { getMachineStatus, machineStatusToText } from '$lib/types/database';
	import { getAverageJobDuration, getSuccessRate, getTotalHours } from '$lib/helpers';
	import { ArrowLeft, ChevronDoubleRight, ChevronRight, Wrench } from 'svelte-heros-v2';
	import { AlertType, addAlert, alerts } from '$lib/stores/alerts';

    export let data: PageServerData;
    export let form: ActionData;

    $: if (form) form.success ? addAlert(AlertType.INFO, 'Successfully commited all changes!') : addAlert(AlertType.ERROR, 'Error commiting changes to the database...');

    const { session, machine, slug } = data;
</script>

{#if machine}

<div class="flex flex-col space-y-8 lg:my-12 w-full">
    <a href="/machines" class="uppercase text-xl w-fit"><ArrowLeft class="inline" /><span class="ml-4 align-middle">Machine Manager</span></a>
    <!-- Title -->
    <div class="relative flex flex-row justify-between bg-neutral rounded-2xl overflow-hidden p-12 shadow-lg">
        <div class="flex flex-col justify-between items-start space-y-12 z-10">
            <div class="flex flex-col space-y-2">
                <span class="text-5xl font-bold">{machine.nickname}</span>
                <span class="text-2xl">{machine.machine_def.make} {machine.machine_def.model}</span>
            </div>
            <div class="stats bg-base-100 border-info/50 border backdrop-blur z-10">
                <div class="stat">
                    <div class="stat-title">Current Status</div>
                    <div class="stat-value font-mono text-2xl">{machineStatusToText(getMachineStatus(machine))}</div>
                </div>
            </div>
        </div>
        <div class="flex flex-col space-y-12">
            <div class="stats bg-base-100 border-info/50 border backdrop-blur z-10">
                <div class="stat">
                    <div class="stat-title">Total Jobs</div>
                    <div class="stat-value font-mono text-2xl">{machine.prints.length}</div>
                </div>
                <div class="stat">
                    <div class="stat-title">Cancelled Jobs </div>
                    <div class="stat-value font-mono text-2xl">{machine.prints.filter(p => p.cancelled === true).length}</div>
                </div>
                <div class="stat">
                    <div class="stat-title">Success Rate</div>
                    <div class="stat-value font-mono text-2xl">{getSuccessRate(machine).toFixed(0)}%</div>
                </div>
            </div>
            <div class="stats bg-base-100 border-info/50 border backdrop-blur z-10">
                <div class="stat">
                    <div class="stat-title">Total Hours</div>
                    <div class="stat-value font-mono text-2xl">{(getTotalHours(machine) / 1000).toFixed(2)} khrs</div>
                </div>
                <div class="stat">
                    <div class="stat-title">Total Extruded</div>
                    <div class="stat-value font-mono text-2xl">{(getTotalHours(machine) / 1000).toFixed(2)} kg</div>
                </div>
                <div class="stat">
                    <div class="stat-title">Avg. Job Duration</div>
                    <div class="stat-value font-mono text-2xl">{getAverageJobDuration(machine).toFixed(2)} hrs</div>
                </div>
            </div>
        </div>
        <img src="/{machine.machine_def.model}.png" class="w-3/4 absolute -top-1/4 -right-8 opacity-50 select-none blur-sm">
    </div>
    <div class="divider"></div>
    <FaultTable faults={machine.faults.map(f => { return {...f, checked: false} } )} />
    <div class="divider"></div>
    <PrintLogTable prints={machine.prints || []} />
</div>

{:else}
Machine {slug} could not be found
{/if}