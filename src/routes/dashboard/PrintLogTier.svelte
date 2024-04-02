<script lang="ts">
  import {
    machineStatusToText,
    MachineStatus,
    type UserPermissions,
    getMachineStatusColor,
    type DashboardMachine,

    getTimeUntil

  } from '$lib/types/models';
  import NewIssueModal from '../../lib/components/modals/NewIssueModal.svelte';
  import NewPrintModal from '../../lib/components/modals/NewPrintModal.svelte';
  import CancelPrintModal from '../../lib/components/modals/CancelPrintModal.svelte';
  import { PermFlag, hasPermission } from '$lib/helpers';
  import { onMount } from 'svelte';

  export let userLevel: UserPermissions;
  export let routeData: DashboardMachine[];
  export let tier: number;

  let selectedMachine: DashboardMachine;
  let selectedMachineTime = 0;

  let newIssueModal: NewIssueModal;
  let newPrintModal: NewPrintModal;
  let cancelPrintModal: CancelPrintModal;

  function isTierCertified(tier: number) {
    // Special tier flags
    // Tier 99 is tier 1.5 (BambuLabs)
    if (tier === 99) return hasPermission(userLevel.level, 0, PermFlag.SECOND);
    // Tier 98 is tier 2.5 (Snapmaker)
    if (tier === 98) return hasPermission(userLevel.level, 1, PermFlag.SECOND);

    // Normal tier perms
    return hasPermission(userLevel.level, tier - 1, PermFlag.FIRST);
  }

  function decrementTimers() {
    if (!selectedMachine) return;
    // Move to IDLE state if time has elapsed
    if (selectedMachine.status === MachineStatus.WORKING && selectedMachineTime === 0) selectedMachine.status = MachineStatus.IDLE;
    // Decrement time
    selectedMachineTime = selectedMachineTime > 0 ? selectedMachineTime - 1 : 0;
  }

  $: if (routeData.length > 0 && !selectedMachine) selectMachineTab(routeData[0]);

  onMount(() => {
    setInterval(decrementTimers, 1000);
  });

  function selectMachineTab(machine: DashboardMachine) {
    selectedMachine = machine;
    selectedMachineTime = getTimeUntil(machine.done_at);
    // Move to IDLE state if time has elapsed
    if (selectedMachine.status === MachineStatus.WORKING && selectedMachineTime === 0) selectedMachine.status = MachineStatus.IDLE;
  }
</script>

{#if selectedMachine}
<div class="flex flex-col gap-4 text-base">
  <!-- Header -->
  <div class="flex flex-row justify-between items-center window-header">
    {#if tier === 99}
      <div class="font-thin text-xl md:text-2xl">Tier 1.5 Printers</div>
    {:else if tier === 98}
      <div class="font-thin text-xl md:text-2xl">Tier 2.5 Printers</div>
    {:else}
      <div class="font-thin text-xl md:text-2xl">Tier {tier} Printers</div>
    {/if}
    
    <div class="flex flex-row">
      <div class="font-thin mr-2 hidden sm:block">Legend</div>
      <div class="flex bg-base-100 border border-base-content/10 rounded">
        <div class="bg-base-100 text-base-content rounded-l text-xs uppercase px-2 py-1">Idle</div>
        <div class="bg-info text-info-content text-xs uppercase px-2 py-1">Printing</div>
        <div class="bg-warning text-warning-content rounded-r text-xs uppercase px-2 py-1">Fault</div>
      </div>
    </div>
  </div>

  <div class="hidden xl:block">
    <div class="tabs border-none justify-between">
      {#each routeData as machine}
        <button
          class="rounded-t-2xl translate-y-[1px] tab my-tab-lifted tab-lg grow border border-transparent {
          selectedMachine === machine
            ? 'tab-active bg-base-100 !border-base-content/5'
            : ''} {getMachineStatusColor(machine.status)}"
          on:click={() => selectMachineTab(machine)}
        >
          {machine.nickname}
        </button>
      {/each}
    </div>
    <div
      class="rounded-b-2xl border border-t-0 border-base-content/5 bg-base-100 relative"
      class:rounded-tl-2xl={routeData.indexOf(selectedMachine) !== 0}
      class:rounded-tr-2xl={routeData.indexOf(selectedMachine) !== routeData.length - 1}
    >
      <div class="absolute rounded-b-2xl w-full h-full overflow-hidden">
        <img
          alt="Printer"
          src="{selectedMachine.model}.png"
          class="w-1/2 absolute blur opacity-25 left-16 pointer-events-none select-none"
        />
      </div>
      <div class="flex flex-row justify-between p-12">
        <div class="flex flex-col justify-start space-y-2">
          <span class="text-3xl font-thin">{selectedMachine.nickname}</span>
            <span class="text-base sm:text-2xl font-thin grow">
            {selectedMachine.make}
            {selectedMachine.model}
            </span>
        </div>
        <div
          class="z-0 basis-1/2 flex flex-col justify-start space-y-4 p-4 h-72 rounded-2xl bg-base-100 border border-base-content/5 bg-opacity-75"
        >
          <div class="stats h-24 bg-base-200 bg-opacity-50">
            <div class="stat">
              <div class="stat-title w-24 sm:text-sm">Status</div>
              <div class="stat-value font-light tracking-wide sm:text-2xl">
                {machineStatusToText(selectedMachine.status)}
              </div>
            </div>
            <div class="stat">
							<div class="stat-title sm:text-sm">Time Remaining</div>
							<div class="stat-value font-light tracking-wide sm:text-2xl">
								{#if selectedMachine.status === MachineStatus.WORKING}
								<span class="countdown">
									<span style:--value={Math.floor(selectedMachineTime / 60 / 60)}></span>h
									<span style:--value={Math.floor((selectedMachineTime / 60) % 60)}></span>m
									<span style:--value={Math.floor(selectedMachineTime % 60)}></span>s
								</span>
								{:else}
								-
								{/if}
							</div>
            </div>
          </div>
          <div class="divider"></div>
          {#if isTierCertified(tier)}
            <div class="flex flex-row space-x-4">
              <button
                class="btn btn-accent flex-1"
                on:click={() => cancelPrintModal.launchModal(selectedMachine)}
                disabled={selectedMachine.status !== MachineStatus.WORKING}
              >
                Cancel Print
              </button>
              <button
                class="btn btn-error flex-1"
                on:click={() => newIssueModal.launchModal(selectedMachine)}
                disabled={selectedMachine.status === MachineStatus.FAULT}
              >
                Report Issue
              </button>
            </div>
            <button
              class="btn btn-accent"
              on:click={() => newPrintModal.launchModal(selectedMachine)}
              disabled={selectedMachine.status === MachineStatus.WORKING ||
                selectedMachine.status === MachineStatus.FAULT}
            >
              Log Print
            </button>
          {:else}
            <div class="grow"></div>
            <p class="self-center uppercase text-center">
              Tier {tier} cert required to<br />log a print for this machine
            </p>
            <div class="grow"></div>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <div class="xl:hidden">
    <div class="join rounded-none md:rounded-2xl join-vertical w-full">
      {#each routeData as machine}
        <button
          class="collapse join-item bg-base-100 outline outline-1 outline-base-content/5"
          on:click={() => selectMachineTab(machine)}
          role="tab"
          tabindex="-1"
        >
          <input type="radio" name="accordion-1" />
          <div
            class="collapse-title text-xl font-medium bg-gradient-to-l to-base-100 outline outline-1 outline-base-content/25"
            class:from-warning={machine.status === MachineStatus.FAULT}
            class:from-info={machine.status === MachineStatus.WORKING}
            class:from-base-100={machine.status === MachineStatus.IDLE}
          >
            <span class="font-light tracking-wide text-base">{machine.nickname}</span>
          </div>
          <div class="collapse-content">
            <div class="flex justify-center pt-6">
              <div class="stats h-24 shadow-lg bg-base-200 bg-opacity-50 w-full">
                <div class="stat">
                  <!-- <div class="stat-figure"><Bolt /></div> -->
                  <div class="stat-title w-24 sm:text-sm">Status</div>
                  <div class="stat-value font-light tracking-wide text-base sm:text-2xl">
                    {machineStatusToText(machine.status)}
                  </div>
                </div>
                <div class="stat rounded-l-none">
                  {#if machine.status === MachineStatus.WORKING}
                    <div class="stat-title sm:text-sm">Time Remaining</div>
                    <div class="stat-value font-light tracking-wide text-base sm:text-2xl">
                      <span class="countdown">
                        <span class="rounded-none" style:--value={Math.floor(selectedMachineTime / 60 / 60)}></span>:
                        <span class="rounded-none" style:--value={Math.floor((selectedMachineTime / 60) % 60)}></span>:
                        <span class="rounded-none" style:--value={Math.floor(selectedMachineTime % 60)}></span>
                      </span>
                    </div>
                  {:else}
                    <div class="stat-title sm:text-sm">Time Remaining</div>
                    <div class="stat-value font-light tracking-wide text-base sm:text-2xl">
                      -
                    </div>
                  {/if}
                </div>
              </div>
            </div>
            <div class="divider"></div>
            {#if isTierCertified(tier)}
              <div class="flex flex-col gap-4">
                <button
                  class="btn btn-accent"
                  on:click={() => newPrintModal.launchModal(selectedMachine)}
                  disabled={selectedMachine.status === MachineStatus.WORKING ||
                    selectedMachine.status === MachineStatus.FAULT ||
                    !isTierCertified(1)}
                >
                  Log Print
                </button>
                <button
                  class="btn btn-accent"
                  on:click={() => cancelPrintModal.launchModal(selectedMachine)}
                  disabled={selectedMachine.status !== MachineStatus.WORKING}
                >
                  Cancel Print
                </button>
                <button
                  class="btn btn-error"
                  on:click={() => newIssueModal.launchModal(selectedMachine)}
                  disabled={selectedMachine.status === MachineStatus.FAULT}
                >
                  Report Issue
                </button>
              </div>
            {:else}
              <div class="grow"></div>
              {#if tier === 99}
                <p class="self-center uppercase text-center">
                  Tier 1.5 cert required to<br />log a print for this machine
                </p>
              {:else if tier === 98}
                <p class="self-center uppercase text-center">
                  Tier 2.5 cert required to<br />log a print for this machine
                </p>
              {:else}
                <p class="self-center uppercase text-center">
                  Tier {tier} cert required to<br />log a print for this machine
                </p>
              {/if}
              <div class="grow"></div>
            {/if}
          </div>
        </button>
      {/each}
    </div>
  </div>
</div>
{/if}

<NewIssueModal bind:this={newIssueModal} />
<NewPrintModal bind:this={newPrintModal} />
<CancelPrintModal bind:this={cancelPrintModal} />

<style>
  .my-tab-lifted::after,
  .my-tab-lifted::before {
    background-image: radial-gradient(
      circle at var(--circle-pos),
      transparent var(--tab-grad),
      transparent calc(var(--tab-grad) + 0.3px),
      transparent calc(var(--tab-grad) + var(--tab-border, 1px)),
      var(--tab-bg) calc(var(--tab-grad) + var(--tab-border, 1px) + 0.3px)
    ) !important;
  }

  .my-tab-lifted:first-of-type::before {
    background-image: none !important;
  }

  .my-tab-lifted:last-of-type::after {
    background-image: none !important;
  }
</style>