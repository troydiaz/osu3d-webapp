<script lang="ts">
  import type { PageData } from "./$types";
  import { MachineStatus } from "$lib/types/models";
  import CancelPrintModal from "$lib/components/modals/CancelPrintModal.svelte";
  import NewPrintModal from "$lib/components/modals/NewPrintModal.svelte";
  import NewIssueModal from "$lib/components/modals/NewIssueModal.svelte";
  
  export let data: PageData;
  const { permissions, routeData, session } = data;

  let cancelPrintModal: CancelPrintModal;
  let newPrintModal: NewPrintModal;
  let newIssueModal: NewIssueModal;

  $: idleMachines = routeData.filter(m => m.status === MachineStatus.IDLE);
</script>

<svelte:head>
  <title>Print | OSU 3D</title>
</svelte:head>

{#if routeData && permissions}
<div class="flex flex-col gap-12 w-full">

  <div>
    <div class="text-2xl font-thin">Print</div>
  </div>

  <div class="grid grid-cols-4 gap-12 w-fit">
    {#each idleMachines as machine}
      <div class="col-span-1">
          <button class="btn btn-ghost  p-4 h-full w-full"
            on:click={() => newPrintModal.launchModal(machine)}
          >
            <div class="flex flex-col gap-2 justify-center items-center">
              <img src="/{machine.model}.png" class="max-h-28 w-fit" />
              <div class="text-xl font-thin">{machine.nickname}</div>
              <div class="text-sm font-thin">Tier {machine.tier}</div>
            </div>
          </button>
      </div>
      
    {/each}
    
  </div>


  <!-- <PrintLogTier routeData={routeData.filter(m => m.tier === 1)} tier={1} userLevel={permissions} />
  <PrintLogTier routeData={routeData.filter(m => m.tier === 99)} tier={99} userLevel={permissions} />
  <PrintLogTier routeData={routeData.filter(m => m.tier === 2)} tier={2} userLevel={permissions} />
  <PrintLogTier routeData={routeData.filter(m => m.tier === 98)} tier={98} userLevel={permissions} />
  <PrintLogTier routeData={routeData.filter(m => m.tier === 3)} tier={3} userLevel={permissions} /> -->
</div>
{/if}

<CancelPrintModal bind:this={cancelPrintModal} />
<NewPrintModal bind:this={newPrintModal} />
<NewIssueModal bind:this={newIssueModal} />