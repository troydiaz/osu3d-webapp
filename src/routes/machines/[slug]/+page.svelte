<script lang="ts">
  import type { ActionData, PageServerData } from './$types';
  import FaultTable from '$lib/components/tables/FaultTable.svelte';
  import PrintLogTable from '$lib/components/tables/PrintLogTable.svelte';
  import { getMachineStatus, machineStatusToText } from '$lib/types/database';
  import { getAverageJobDuration, getSuccessRate, getTotalExtrudedInKg, getTotalHours } from '$lib/helpers';
  import PageHeader from '$lib/components/PageHeader.svelte';
	import printer from '$lib/images/printer.png';
  
  export let data: PageServerData;
  export let form: ActionData;
  
  const { machine, slug } = data;
</script>

<svelte:head>
  <title>Printers | OSU 3D</title>
</svelte:head>

{#if machine}
<div class="flex flex-col gap-12 w-full">
  <PageHeader name="Edit Printer" backUrl="/machines" image={printer} />
  
  <!-- Title -->
  <div class="window relative flex flex-row justify-between !p-12">
    <div class="flex flex-col justify-between items-start space-y-12 z-10">
      <div class="flex flex-col space-y-2">
        <span class="text-5xl font-thin">{machine.nickname}</span>
        <span class="text-2xl">{machine.machine_def.make} {machine.machine_def.model}</span>
      </div>
      <div class="stats bg-base-100 z-10">
        <div class="stat">
          <div class="stat-title">Current Status</div>
          <div class="stat-value font-mono text-2xl">{machineStatusToText(getMachineStatus(machine))}</div>
        </div>
      </div>
    </div>
    <div class="flex flex-col space-y-12">
      <div class="stats bg-base-200 z-10">
        <div class="stat">
          <div class="stat-title">Total Jobs</div>
          <div class="stat-value font-mono text-2xl">{machine.prints.length}</div>
        </div>
        <div class="stat">
          <div class="stat-title">Canceled Jobs </div>
          <div class="stat-value font-mono text-2xl">{machine.prints.filter(p => p.status === 'CANCELED').length}</div>
        </div>
        <div class="stat">
          <div class="stat-title">Success Rate</div>
          <div class="stat-value font-mono text-2xl">{getSuccessRate(machine).toFixed(0)}%</div>
        </div>
      </div>
      <div class="stats bg-base-200 z-10">
        <div class="stat">
          <div class="stat-title">Total Hours</div>
          <div class="stat-value font-mono text-2xl">{(getTotalHours(machine) / 1000).toFixed(2)} khrs</div>
        </div>
        <div class="stat">
          <div class="stat-title">Total Extruded</div>
          <div class="stat-value font-mono text-2xl">{(getTotalExtrudedInKg(machine)).toFixed(2)} kg</div>
        </div>
        <div class="stat">
          <div class="stat-title">Avg. Job Duration</div>
          <div class="stat-value font-mono text-2xl">{getAverageJobDuration(machine).toFixed(2)} hrs</div>
        </div>
      </div>
    </div>
    <img src="/{machine.machine_def.model}.png" class="w-3/4 absolute -top-1/4 -right-8 opacity-25 select-none blur-sm">
  </div>
  <FaultTable faults={machine.events.map(e => { return {...e, checked: false} } )} />
  <PrintLogTable prints={machine.prints || []} />
</div>
{:else}
Machine {slug} could not be found
{/if}