<script lang="ts">
  import type { PageServerData } from './$types';
  import FaultTable from '$lib/components/tables/FaultTable.svelte';
  import PrintLogTable from '$lib/components/tables/PrintLogTable.svelte';
  import { getMachineStatus, machineStatusToText } from '$lib/types/models';
  import { getAverageJobDuration, getSuccessRate, getTotalExtrudedInKg, getTotalHours } from '$lib/helpers';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import printer from '$lib/images/printer.png';

  export let data: PageServerData;
  const { machine, slug } = data;
</script>

<svelte:head>
  <title>Printers | OSU 3D</title>
</svelte:head>

{#if machine}
  <div class="page">
    <PageHeader name="Printers" backUrl="/machines" />

    <!-- Title -->
    <div class="window justify-between relative !flex-row !gap-8 !p-8 overflow-hidden">
      <div class="flex flex-col justify-between items-start gap-4 md:gap-12 z-10">
        <div class="flex flex-col space-y-2">
          <span class="text-3xl font-thin">{machine.nickname}</span>
          <span class="hidden md:inline text-base sm:text-2xl font-thin"
            >{machine.machine_def.make} {machine.machine_def.model}</span
          >
        </div>
        <div class="stats bg-base-200 z-10">
          <div class="stat">
            <div class="stat-title">Current Status</div>
            <div class="stat-value font-mono text-2xl">{machineStatusToText(getMachineStatus(machine))}</div>
          </div>
        </div>
      </div>
      <div class="hidden md:flex flex-col space-y-8">
        <div class="stats bg-base-200 z-10">
          <div class="stat">
            <div class="stat-title">Total Jobs</div>
            <div class="stat-value font-mono text-2xl">{machine.prints.length}</div>
          </div>
          <div class="stat">
            <div class="stat-title">Canceled Jobs</div>
            <div class="stat-value font-mono text-2xl">
              {machine.prints.filter((p) => p.status === 'CANCELED').length}
            </div>
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
            <div class="stat-value font-mono text-2xl">{getTotalExtrudedInKg(machine).toFixed(2)} kg</div>
          </div>
          <div class="stat">
            <div class="stat-title">Avg. Job Duration</div>
            <div class="stat-value font-mono text-2xl">{getAverageJobDuration(machine).toFixed(2)} hrs</div>
          </div>
        </div>
      </div>
      <img
        alt="Printer"
        src="/{machine.machine_def.model}.png"
        class="w-3/4 aspect-square max-w-lg absolute -top-1/4 -right-8 opacity-25 select-none blur-sm"
      />
    </div>
    <FaultTable
      faults={machine.events.map((e) => {
        return { ...e, checked: false };
      })}
    />
    <PrintLogTable prints={machine.prints || []} />
  </div>
{:else}
  Machine {slug} could not be found
{/if}
