<script lang="ts">
  import type { PageData } from "./$types";
  import { MachineStatus, type DashboardMachine } from "$lib/types/models";
  import CancelPrintModal from "$lib/components/modals/CancelPrintModal.svelte";
  import NewPrintModal from "$lib/components/modals/NewPrintModal.svelte";
  import NewIssueModal from "$lib/components/modals/NewIssueModal.svelte";
  import { fade, fly, scale, blur } from "svelte/transition";
  import { isTierCertified } from "$lib/helpers";
  import { ClipboardPen, Octagon, Tag, Activity, CircleAlert, Rocket } from "lucide-svelte";
  import PageHeader from "$lib/components/PageHeader.svelte";
  
  export let data: PageData;
  const { permissions, routeData, session } = data;

  let status: MachineStatus = MachineStatus.IDLE;

  let cancelPrintModal: CancelPrintModal;
  let newPrintModal: NewPrintModal;
  let newIssueModal: NewIssueModal;

  const priorityOrder = [
    MachineStatus.IDLE,
    MachineStatus.WORKING,
    MachineStatus.FAULT
  ];

  $: certifiedMachines = routeData.filter(m =>  m.status === status)
    .sort((a, b) => {
      const aIndex = priorityOrder.indexOf(a.status);
      const bIndex = priorityOrder.indexOf(b.status);
      return aIndex - bIndex;
    });

  function getBackgroundStyles(machine: DashboardMachine) {
    switch (machine.status) {
      case MachineStatus.WORKING:
        return '!bg-info/20';
      case MachineStatus.FAULT:
        return '!bg-error/20';
      default:
        return '';
    }
  }

  function getStatus(machine: DashboardMachine) {
    switch (machine.status) {
      case MachineStatus.WORKING:
        return 'Busy'
      case MachineStatus.FAULT:
        return 'Issue';
      default:
        return `Tier ${machine.tier}`;
    }
  }

  function getStatusStyles(machine: DashboardMachine) {
    switch (machine.status) {
      case MachineStatus.WORKING:
        return 'text-info';
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
<div class="page">

  <div class="flex md:flex-row flex-col justify-between align-center gap-8">
    <PageHeader name="Print" />

    <!-- Buttons -->
    <div class="join join-horizontal rounded-lg w-full md:w-72">
      <button class="basis-1/3 grow h-fit btn px-2 join-item !ml-0 border-none btn-neutral {status === MachineStatus.IDLE ? 'hover:bg-info/50 bg-info/50' : 'hover:bg-info/25'}" on:click={() => status = MachineStatus.IDLE}>
        <div class="my-2 gap-2 items-center justify-center flex flex-col">
          <Rocket /><div>Ready</div>
        </div>
      </button>
      <button class="basis-1/3 grow h-fit btn px-2 join-item !ml-0 border-0 btn-neutral {status === MachineStatus.WORKING ? 'hover:bg-info/50 bg-info/50' : 'hover:bg-info/25'}" on:click={() => status = MachineStatus.WORKING}>
        <div class="my-2 gap-2 items-center justify-center flex flex-col">
          <Activity /><div>Busy</div>
        </div>
      </button>
      <button class="basis-1/3 grow h-fit btn px-2 join-item !ml-0 border-0 btn-neutral {status === MachineStatus.FAULT ? 'hover:bg-info/50 bg-info/50' : 'hover:bg-info/25'}" on:click={() => status = MachineStatus.FAULT}>
        <div class="my-2 gap-2 items-center justify-center flex flex-col">
          <CircleAlert /><div>Issue</div>
        </div>
      </button>
    </div>
  </div>


  {#key status}
    <div class="static grid grid-col-1 lg:grid-cols-2 xl:grid-cols-3 md:gap-12" in:fly={{ y: 10, delay: 500 }} out:fade={{ duration: 250 }}>
      {#if certifiedMachines.length === 0}
        <div class="col-span-1 lg:col-span-2 xl:col-span-3 flex justify-center items-center pt-8">
          <div class="text-2xl font-thin">No results...</div>
        </div>
      {/if}
    
      {#each certifiedMachines as machine}
        <div class="col-span-1 window !p-0 dark:bg-slate-400/10 {getBackgroundStyles(machine)}">
            <div class="flex flex-col gap-8 h-full w-full">
              <div class="flex flex-col grow gap-8 justify-start items-center">
                <div class="flex justify-between w-full border-b border-white/10 box-border">
                  <div class="p-4 flex items-center">
                    <div class="rounded-full flex flex-col justify-center">
                      <span class="text-xl text-center font-semibold {getStatusStyles(machine)}">{getStatus(machine)}</span>
                    </div>
                  </div>
                  <div class="text-xl p-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-full {getStatusStyles(machine)}">{machine.nickname}</div>
    
                </div>
                <div class="aspect-square flex flex-col justify-center {machine.status === MachineStatus.FAULT ? 'opacity-25' : ''}"><img src="/{machine.model}.png" class="max-h-24 md:max-h-48 w-fit" /></div>
              </div>
              <!-- Buttons -->
              <div class="relative join join-horizontal rounded-t-none w-full md:border-t border-white/10">
                <button class="basis-1/3 grow h-full btn px-2 join-item !ml-0 border-none btn-neutral bg-info/25 hover:bg-info/50" disabled={machine.status !== MachineStatus.IDLE || !isTierCertified(permissions, machine.tier)} on:click={() => newPrintModal.launchModal(machine)}>
                  <div class="my-2 gap-2 items-center justify-center flex flex-col">
                    <ClipboardPen /><div>Log</div>
                  </div>
                </button>
                <button class="basis-1/3 grow h-full btn px-2 join-item !ml-0 border-0 btn-neutral text-warning bg-warning/25 hover:bg-warning/50" disabled={machine.status !== MachineStatus.WORKING || !isTierCertified(permissions, machine.tier)} on:click={() => cancelPrintModal.launchModal(machine)}>
                  <div class="my-2 gap-2 items-center justify-center flex flex-col">
                    <Octagon /><div>Stop</div>
                  </div>
                </button>
                <button class="basis-1/3 grow h-full btn px-2 join-item !ml-0 border-0 btn-neutral text-error bg-error/25 hover:bg-error/50" disabled={machine.status === MachineStatus.FAULT || !isTierCertified(permissions, machine.tier)} on:click={() => newIssueModal.launchModal(machine)}>
                  <div class="my-2 gap-2 items-center justify-center flex flex-col">
                    <Tag /><div>Issue</div>
                  </div>
                </button>
                {#if !isTierCertified(permissions, machine.tier)}
                  <div class="absolute inset-0 flex justify-center items-center left-[1px] bg-gradient-to-t from-warning/50 to-warning/20">
                    <div class="text-white text-2xl font-thin">Tier Certification Required</div>
                  </div>
                {/if}
              </div>
            </div>
        </div>
      {/each}
    
    </div>
  {/key}

</div>
{/if}

<CancelPrintModal bind:this={cancelPrintModal} />
<NewPrintModal bind:this={newPrintModal} />
<NewIssueModal bind:this={newIssueModal} />