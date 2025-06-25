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
  import { printFilter } from "$lib/state";
  import { browser } from "$app/environment";
  import { onMount } from 'svelte';
  import PrintDoneModal from '$lib/components/modals/PrintDoneModal.svelte';
  import { CheckCircle } from 'lucide-svelte';
    
  export let data: PageData;
  const { permissions, routeData } = data;

  let printDoneModal: PrintDoneModal;
  let filter: { status?: MachineStatus | null, tier?: number | null } = { status: null, tier: null };

  if (browser) {
    filter = $printFilter;
  }

  function setFilter(newFilter: { status?: MachineStatus | null, tier?: number | null }) {
    filter = { ... filter, ...newFilter };
    $printFilter = filter;
  }

  let cancelPrintModal: CancelPrintModal;
  let newPrintModal: NewPrintModal;
  let newIssueModal: NewIssueModal;

  $: certifiedMachines = routeData.filter(m => (m.status === filter.status || filter.status === null) && (m.tier === filter.tier || filter.tier === null))
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

  let now = Date.now();

  onMount(() => {
    const iv = setInterval(() => (now = Date.now()), 1000);
    return () => clearInterval(iv);
  });

  function isWorking(machine: DashboardMachine): boolean {
    return (
      machine.status === MachineStatus.WORKING &&
      !!machine.print_done_at &&
      now < new Date(machine.print_done_at).getTime()
    );
  }


  function displayStatus(machine: DashboardMachine): MachineStatus {
    if (machine.status === MachineStatus.FAULT) return MachineStatus.FAULT;
    return isWorking(machine)
      ? MachineStatus.WORKING
      : MachineStatus.IDLE;
  }

  /** percent complete between start and end */
  function getProgress(m: DashboardMachine): number {
    if (!m.print_created_at || !m.print_done_at) return 0;
    const start = new Date(m.print_created_at).getTime();
    const end = new Date(m.print_done_at).getTime();
    return Math.max(0, Math.min(100, ((now - start) / (end - start)) * 100));
  }

  function secsLeft(m: DashboardMachine): number {
    if (!m.print_done_at) return 0;
    const seconds = Math.max(0, Math.ceil((new Date(m.print_done_at).getTime() - now) / 1000));
    return seconds;
  }

  function formatMinutes(seconds: number): string {
    const minutes = Math.ceil(seconds / 60); // round up to the next full minute
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  }
</script>

<svelte:head>
  <title>Print | OSU 3D</title>
</svelte:head>

{#if routeData && permissions}
<div class="page">
  

    
  <div class="flex lg:flex-row lg:justify-between flex-col flex-wrap md:gap-12">
    <PageHeader name="Print" />
    <div class="flex md:gap-12 gap-4 flex-wrap">
      <div class="flex flex-col gap-2">
        <div>Tier</div>
        <!-- Buttons -->
        <div class="join join-horizontal">
          <input data-sveltekit-reload type="radio" name="options" aria-label="Tier 1" class="btn join-item" checked={filter.tier === 1} on:click={() => setFilter({ tier: 1 })} />
          <input data-sveltekit-reload type="radio" name="options" aria-label="Tier 2" class="btn join-item" checked={filter.tier === 2} on:click={() => setFilter({ tier: 2 })} />
          <input data-sveltekit-reload type="radio" name="options" aria-label="Tier 3" class="btn join-item" checked={filter.tier === 3} on:click={() => setFilter({ tier: 3 })} />
          <input data-sveltekit-reload type="radio" name="options" aria-label="Any" class="btn join-item" checked={filter.tier === null} on:click={() => setFilter({ tier: null })} />
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div>Status</div>
        <!-- Buttons -->
        <div class="join join-horizontal">
          <input type="radio" name="options2" aria-label="Ready" class="btn join-item" checked={filter.status === MachineStatus.IDLE} on:click={() => setFilter({ status: MachineStatus.IDLE })} />
          <input type="radio" name="options2" aria-label="Busy" class="btn join-item" checked={filter.status === MachineStatus.WORKING} on:click={() => setFilter({ status: MachineStatus.WORKING })} />
          <input type="radio" name="options2" aria-label="Down" class="btn join-item" checked={filter.status === MachineStatus.FAULT} on:click={() => setFilter({ status: MachineStatus.FAULT })} />
          <input type="radio" name="options2" aria-label="Any" class="btn join-item" checked={filter.status === null} on:click={() => setFilter({ status: null })} />
        </div>
      </div>
    </div>
  </div>

  {#key filter}
    <div class="static grid grid-col-1 lg:grid-cols-2 xl:grid-cols-3 md:gap-12" in:fly={{ y: 10, delay: 500 }} out:fade={{ duration: 250 }}>
      {#if certifiedMachines.length === 0}
        <div class="col-span-4 flex flex-col justify-start items-center pt-16 gap-8 opacity-25">
          <Brackets class="w-24 h-24 stroke-1 animate-bounce" />
          <div class="text-3xl font-mono">No results</div>
        </div>
      {/if}
    
      {#each certifiedMachines as machine}
      <div class="col-span-1 window !p-0 {getBackgroundStyles({ ...machine, status: displayStatus(machine) })}">
            <div class="flex flex-col gap-8 h-full w-full">
              <div class="flex flex-col grow gap-8 justify-start items-center">
                <div class="flex justify-between w-full border-b border-base-content/25">
                  <div class="p-4 flex items-center">
                    <div class="flex flex-col justify-center">
                      <span 
                        class="text-xl text-center font-semibold {getStatusStyles({ ...machine, status: displayStatus(machine) })}"
                      >
                        {getStatus({ ...machine, status: displayStatus(machine) })}
                      </span>
                    </div>
                  </div>
                  <div class="text-xl p-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-full {getStatusStyles({ ...machine, status: displayStatus(machine) })}">
                    {machine.nickname}
                  </div>
                </div>
                <div class="aspect-square flex flex-col justify-center {displayStatus(machine) === MachineStatus.FAULT ? 'opacity-25' : ''}">
                  <img
                    src="/{machine.model}.png"
                    alt="{machine.nickname} printer"
                    class="h-36 w-36 md:h-48 md:w-48"
                  />
                </div>
                {#if isWorking(machine) && machine.print_id && machine.print_created_at && machine.print_done_at}
                <div class="w-full px-4">
                  <!-- labels row -->
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-sm font-medium text-base-content/80">
                      {formatMinutes(secsLeft(machine))} remaining
                    </span>
                    <span class="text-sm font-medium text-base-content/80">
                      {getProgress(machine).toFixed(0)}% complete
                    </span>
                  </div>
                  <!-- bar track -->
                  <div class="h-1.5 bg-base-300 rounded-full overflow-hidden">
                    <!-- bar fill -->
                    <div
                      class="h-full bg-info transition-all duration-200"
                      style="width: {getProgress(machine)}%;"
                    ></div>
                  </div>
                </div>
              {/if}
              </div>
              <!-- Buttons -->
              <div class="relative join join-horizontal rounded-t-none rounded-box w-full border-t border-base-content/25">
                <button class="basis-1/4 grow h-full btn px-2 join-item !ml-0 border-none btn-primary" disabled={displayStatus(machine) !== MachineStatus.IDLE || !isTierCertified(permissions, machine.tier)} on:click={() => newPrintModal.launchModal(machine)}>
                  <div class="my-2 gap-2 items-center justify-center flex flex-col">
                    <ClipboardPen /><div>Log</div>
                  </div>
                </button>
                <button class="basis-1/4 grow h-full btn px-2 join-item !ml-0 border-0 btn-secondary" disabled={!isWorking(machine) || !isTierCertified(permissions, machine.tier)} on:click={() => cancelPrintModal.launchModal(machine)}>
                  <div class="my-2 gap-2 items-center justify-center flex flex-col">
                    <Octagon /><div>Stop</div>
                  </div>
                </button>
                  <button
                  class="basis-1/4 grow h-full btn px-2 join-item !ml-0 border-none btn-success"
                    disabled={!isWorking(machine) || !isTierCertified(permissions, machine.tier)}
                    on:click={() => printDoneModal.launchModal(machine)}
                  >
                    <div class="my-2 flex flex-col items-center gap-2">
                      <CheckCircle /><div>Done</div>
                    </div>
                </button>
                <button class="basis-1/4 grow h-full btn px-2 join-item !ml-0 border-0 btn-accent" disabled={displayStatus(machine) === MachineStatus.FAULT || !isTierCertified(permissions, machine.tier)} on:click={() => newIssueModal.launchModal(machine)}>
                  <div class="my-2 gap-2 items-center justify-center flex flex-col">
                    <Tag /><div>Issue</div>
                  </div>
                </button>
                {#if !isTierCertified(permissions, machine.tier)}
                  <div class="absolute inset-0 flex justify-center items-center left-[1px] bg-gradient-to-t from-warning/75 to-warning/50 rounded-b-box">
                    <div class="text-warning-content text-xl">Certification Required</div>
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
<PrintDoneModal   bind:this={printDoneModal} />
<NewIssueModal bind:this={newIssueModal} />