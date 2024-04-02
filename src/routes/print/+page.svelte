<script lang="ts">
  import type { PageData } from "./$types";
  import { MachineStatus, type DashboardMachine } from "$lib/types/models";
  import CancelPrintModal from "$lib/components/modals/CancelPrintModal.svelte";
  import NewPrintModal from "$lib/components/modals/NewPrintModal.svelte";
  import NewIssueModal from "$lib/components/modals/NewIssueModal.svelte";
  import { fade } from "svelte/transition";
  import { isTierCertified } from "$lib/helpers";
  
  export let data: PageData;
  const { permissions, routeData, session } = data;

  let cancelPrintModal: CancelPrintModal;
  let newPrintModal: NewPrintModal;
  let newIssueModal: NewIssueModal;

  $: idleMachines = routeData.filter(m => m.status === MachineStatus.IDLE);
  $: certifiedMachines = routeData.filter(m => isTierCertified(permissions, m.tier));

  function getOutlineStyles(machine: DashboardMachine) {
    switch (machine.status) {
      case MachineStatus.WORKING:
        return 'outline-info/75 outline-2';
      case MachineStatus.FAULT:
        return 'outline-error outline-1';
      default:
        return 'outline-white/10';
    }
  }

  function getButtonStyles(machine: DashboardMachine) {
    switch (machine.status) {
      case MachineStatus.WORKING:
      case MachineStatus.FAULT:
        return 'btn-disabled !text-opacity-100';
      default:
        return '';
    }
  }

  function getImageStyles(machine: DashboardMachine) {
    switch (machine.status) {
      case MachineStatus.WORKING:
      case MachineStatus.FAULT:
        return 'opacity-50';
      default:
        return '';
    }
  }

  function getStatus(machine: DashboardMachine) {
    switch (machine.status) {
      case MachineStatus.WORKING:
        return 'Busy'
      case MachineStatus.FAULT:
        return 'Fault';
      default:
        return `Tier ${machine.tier}`;
    }
  }

  function getStatusStyles(machine: DashboardMachine) {
    switch (machine.status) {
      case MachineStatus.WORKING:
        return 'text-info;'
      case MachineStatus.FAULT:
        return 'text-error';
      default:
        return '';
    }
  }
</script>

<svelte:head>
  <title>Print | OSU 3D</title>
</svelte:head>

{#if routeData && permissions}
<div class="flex flex-col gap-12 w-full">

  <div>
    <div class="text-2xl font-thin">Printers</div>
  </div>

  <div class="grid grid-col-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
    {#each certifiedMachines as machine}
      <div class="col-span-1 dark:bg-slate-400/10 backdrop-blur-xl rounded-lg outline-1 outline {getOutlineStyles(machine)}" in:fade>
          <div class="h-full w-full">
            <div class="flex flex-col gap-2 justify-center items-center m-2">
              <img src="/{machine.model}.png" class="max-h-28 w-fit" />
              <div class="text-xl font-thin">{machine.nickname}</div>
              <div class=" {getStatusStyles(machine)}">{getStatus(machine)}</div>
            </div>

            <!-- Buttons -->
            <div class="join join-vertical rounded-t-none w-full">
              <button class="btn px-2 join-item" on:click={() => newPrintModal.launchModal(machine)}>Log Print</button>
              <button class="btn px-2 join-item">Stop Print</button>
              <button class="btn px-2 join-item">Report Issue</button>
            </div>
          </div>
      </div>
    {/each}
  </div>
</div>
{/if}

<CancelPrintModal bind:this={cancelPrintModal} />
<NewPrintModal bind:this={newPrintModal} />
<NewIssueModal bind:this={newIssueModal} />