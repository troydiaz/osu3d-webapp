<script lang="ts">
  import type { PageData } from "./$types";
  import { MachineStatus, type DashboardMachine } from "$lib/types/models";
  import CancelPrintModal from "$lib/components/modals/CancelPrintModal.svelte";
  import NewPrintModal from "$lib/components/modals/NewPrintModal.svelte";
  import NewIssueModal from "$lib/components/modals/NewIssueModal.svelte";
  import { fade, fly } from "svelte/transition";
  import { isTierCertified } from "$lib/helpers";
  import { ClipboardPen, Octagon, Tag, Brackets } from "lucide-svelte";
  import PageHeader from "$lib/components/PageHeader.svelte";
  
  export let data: PageData;
  const { permissions, routeData } = data;

  let filter: { status: MachineStatus | null, tier: number | null } = { status: MachineStatus.IDLE, tier: null };

  let cancelPrintModal: CancelPrintModal;
  let newPrintModal: NewPrintModal;
  let newIssueModal: NewIssueModal;

  $: certifiedMachines = routeData.filter(m =>  (m.status === filter.status || filter.status === null) && (m.tier === filter.tier || filter.tier === null))
    .sort((a, b) => {
      return a.tier - b.tier;
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
  <PageHeader name="Print" />

    
  <div class="flex lg:flex-row flex-col flex-wrap gap-8">


    <div class="flex flex-col gap-2">
      <div>Filter by tier</div>
      <!-- Buttons -->
      <div class="join join-horizontal rounded-lg w-full h-fit">
        <button class="w-24 h-fit btn px-2 join-item !ml-0 border-none {filter.tier === 1 ? 'hover:bg-info/50 bg-info/50' : 'hover:bg-info/25 bg-info/10'}" on:click={() => filter.tier = 1}>
          <div class="my-2 gap-2 items-center justify-center flex flex-col">
            <div>Tier 1</div>
          </div>
        </button>
        <button class="w-24 h-fit btn px-2 join-item !ml-0 border-0 {filter.tier === 2 ? 'hover:bg-info/50 bg-info/50' : 'hover:bg-info/25 bg-info/10'}" on:click={() => filter.tier = 2}>
          <div class="my-2 gap-2 items-center justify-center flex flex-col">
            <div>Tier 2</div>
          </div>
        </button>
        <button class="w-24 h-fit btn px-2 join-item !ml-0 border-0 {filter.tier === 3 ? 'hover:bg-info/50 bg-info/50' : 'hover:bg-info/25 bg-info/10'}" on:click={() => filter.tier = 3}>
          <div class="my-2 gap-2 items-center justify-center flex flex-col">
            <div>Tier 3</div>
          </div>
        </button>
        <button class="w-24 h-fit btn px-2 join-item !ml-0 border-0 {filter.tier === null ? 'hover:bg-info/50 bg-info/50' : 'hover:bg-info/25 bg-info/10'}" on:click={() => filter.tier = null}>
          <div class="my-2 gap-2 items-center justify-center flex flex-col">
            <div>All</div>
          </div>
        </button>
      </div>
    </div>


    <div class="flex flex-col gap-2">
      <div>Filter by status</div>
      <!-- Buttons -->
      <div class="join join-horizontal w-full h-fit">
        <button class="w-24 h-fit btn px-2 join-item !ml-0 border-none {filter.status === MachineStatus.IDLE ? 'hover:bg-info/50 bg-info/50' : 'hover:bg-info/25 bg-info/10'}" on:click={() => filter.status = MachineStatus.IDLE}>
          <div class="my-2 gap-2 items-center justify-center flex flex-col">
            <div>Ready</div>
          </div>
        </button>
        <button class="w-24 h-fit btn px-2 join-item !ml-0 border-0 {filter.status === MachineStatus.WORKING ? 'hover:bg-info/50 bg-info/50' : 'hover:bg-info/25 bg-info/10'}" on:click={() => filter.status = MachineStatus.WORKING}>
          <div class="my-2 gap-2 items-center justify-center flex flex-col">
            <div>Busy</div>
          </div>
        </button>
        <button class="w-24 h-fit btn px-2 join-item !ml-0 border-0 {filter.status === MachineStatus.FAULT ? 'hover:bg-info/50 bg-info/50' : 'hover:bg-info/25 bg-info/10'}" on:click={() => filter.status = MachineStatus.FAULT}>
          <div class="my-2 gap-2 items-center justify-center flex flex-col">
            <div>Down</div>
          </div>
        </button>
        <button class="w-24 h-fit btn px-2 join-item !ml-0 border-0 {filter.status === null ? 'hover:bg-info/50 bg-info/50' : 'hover:bg-info/25 bg-info/10'}" on:click={() => filter.status = null}>
          <div class="my-2 gap-2 items-center justify-center flex flex-col">
            <div>All</div>
          </div>
        </button>
      </div>
    </div>


  </div>

  {#key certifiedMachines}
    <div class="static grid grid-col-1 lg:grid-cols-2 xl:grid-cols-3 md:gap-12" in:fly={{ y: 10, delay: 500 }} out:fade={{ duration: 250 }}>
      {#if certifiedMachines.length === 0}
        <div class="col-span-2 flex flex-col justify-start items-center pt-8 gap-8 opacity-25 dark:opacity-50 animate-pulse">
          <Brackets class="w-32 h-32 stroke-1" />
          <div class="text-3xl font-mono">No results</div>
        </div>
      {/if}
    
      {#each certifiedMachines as machine}
        <div class="col-span-1 window !p-0 dark:bg-slate-400/10 bg-slate-400/10 {getBackgroundStyles(machine)}">
            <div class="flex flex-col gap-8 h-full w-full">
              <div class="flex flex-col grow gap-8 justify-start items-center">
                <div class="flex justify-between w-full border-b border-black/10 dark:border-white/10 box-border">
                  <div class="p-4 flex items-center">
                    <div class="rounded-full flex flex-col justify-center">
                      <span class="text-xl text-center font-semibold {getStatusStyles(machine)}">{getStatus(machine)}</span>
                    </div>
                  </div>
                  <div class="text-xl p-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-full {getStatusStyles(machine)}">{machine.nickname}</div>
    
                </div>
                <div class="aspect-square flex flex-col justify-center {machine.status === MachineStatus.FAULT ? 'opacity-25' : ''}">
                  <img src="/{machine.model}.png" class="h-36 w-36 md:h-48 md:w-48" />
                </div>
              </div>
              <!-- Buttons -->
              <div class="relative join join-horizontal rounded-t-none w-full md:border-t border-black/10 dark:border-white/10">
                <button class="basis-1/3 grow h-full btn px-2 join-item !ml-0 border-none bg-info/25 hover:bg-info/50" disabled={machine.status !== MachineStatus.IDLE || !isTierCertified(permissions, machine.tier)} on:click={() => newPrintModal.launchModal(machine)}>
                  <div class="my-2 gap-2 items-center justify-center flex flex-col">
                    <ClipboardPen /><div>Log</div>
                  </div>
                </button>
                <button class="basis-1/3 grow h-full btn px-2 join-item !ml-0 border-0 bg-warning/25 hover:bg-warning/50" disabled={machine.status !== MachineStatus.WORKING || !isTierCertified(permissions, machine.tier)} on:click={() => cancelPrintModal.launchModal(machine)}>
                  <div class="my-2 gap-2 items-center justify-center flex flex-col">
                    <Octagon /><div>Stop</div>
                  </div>
                </button>
                <button class="basis-1/3 grow h-full btn px-2 join-item !ml-0 border-0 bg-error/25 hover:bg-error/50" disabled={machine.status === MachineStatus.FAULT || !isTierCertified(permissions, machine.tier)} on:click={() => newIssueModal.launchModal(machine)}>
                  <div class="my-2 gap-2 items-center justify-center flex flex-col">
                    <Tag /><div>Issue</div>
                  </div>
                </button>
                {#if !isTierCertified(permissions, machine.tier)}
                  <div class="absolute inset-0 flex justify-center items-center left-[1px] bg-gradient-to-t dark:from-warning/50 dark:to-warning/20 from-warning/75 to-warning/50">
                    <div class="dark:text-white text-2xl font-thin">Tier Certification Required</div>
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