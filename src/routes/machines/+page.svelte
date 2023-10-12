
<script lang="ts">
	import type { PageData } from "./$types";
    import { offset, flip, shift } from 'svelte-floating-ui/dom';
    import { createFloatingActions } from 'svelte-floating-ui';
    import type { ClientRectObject, VirtualElement } from 'svelte-floating-ui/core';
	import { writable } from "svelte/store";
	import FaultHistoryModal from "$lib/components/modals/FaultHistoryModal.svelte";
	import type { Machine } from "$lib/types/database";
	import PrintHistoryModal from "$lib/components/modals/PrintHistoryModal.svelte";
	import { Wrench } from "svelte-heros-v2";
	import MachineTable from "$lib/components/tables/MachineTable.svelte";

    const [floatingRef, floatingContent] = createFloatingActions({
        strategy: 'absolute',
        placement: "bottom",
        middleware: [
            offset({ mainAxis: -20}),
            flip(),
            shift()
        ]
    });

    let x = 0;
    let y = 0;

    function machineRowClicked(event: MouseEvent, machine: Machine) {
        event.preventDefault();
        contextVisible = true;
        contextMachine = machine;
        x = event.clientX;
        y = event.clientY;
    }

    function toggleDeleteModal() {
        contextVisible = false;
        deleteModalVisible = true;
    }

    const mouseLeaveContext = (event: any) => {
        contextVisible = false;
    }

    function getBoundingClientRect(): ClientRectObject {
        return {
            x,
            y,
            top: y,
            left: x,
            bottom: y,
            right: x,
            width: 0,
            height: 0
        }
    };

    const virtualElement = writable<VirtualElement>({ getBoundingClientRect });
    floatingRef(virtualElement);

    export let data: PageData;
    let { session, machines } = data;
    
    let contextVisible = false;
    let contextMachine: Machine | null = null;

    let deleteModalVisible = false;

    let faultHistoryModal: FaultHistoryModal;
    let printHistoryModal: PrintHistoryModal;
</script>

<svelte:head>
    <title>Machine Manager</title>
</svelte:head>

<div class="flex flex-col gap-12 lg:my-12 w-full">
    <div class="relative overflow-hidden flex flex-row justify-between items-center bg-neutral rounded-2xl p-8 shadow-lg">
        <div class="grow"></div>
        <span class="text-5xl font-thin pr-6">Machine Manager</span>
        <Wrench size={'64px'} strokeWidth={'1px'} />
    </div>
    {#if machines}
    <MachineTable machines={machines.filter(m => m.tier === 1)} tier={1} />
    <MachineTable machines={machines.filter(m => m.tier === 2)} tier={2} />
    {/if}
</div>


{#if contextVisible && contextMachine}
<div use:floatingContent on:mouseleave={mouseLeaveContext} role="menu" tabindex="-1" style="z-index: 99;" id="rightclickmenu">
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <ul class="menu shadow-lg bg-white rounded-box w-36">
        <li class="menu-title py-2 select-none"><span>{contextMachine.nickname}</span></li>
        <li><a href="/machines/{contextMachine.id}">Open</a></li>
        <!-- <li><a on:click={() => printHistoryModal.launchModal(contextMachine)}>Print History</a></li>
        <li><a on:click={() => faultHistoryModal.launchModal(contextMachine)}>Fault History</a></li> -->
        <!-- <li><a on:click={() => console.log('lel')}>Edit</a></li> -->
        <!-- <li><a class="link-error" on:click={toggleDeleteModal}>Delete</a></li> -->
    </ul>
</div>
{/if}

<!-- The button to open modal -->
<!-- <label for="delete-machine-modal" class="btn">open modal</label> -->

<!-- Put this part before </body> tag -->
<input type="checkbox" id="delete-machine-modal" class="modal-toggle" bind:checked={deleteModalVisible} />
<div class="modal lg:ml-80">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Delete {contextMachine?.nickname}</h3>
    <p class="py-4">The delete function is disabled in production.</p>
    <div class="modal-action">
      <label for="delete-machine-modal" class="btn">Ok</label>
    </div>
  </div>
</div>

<FaultHistoryModal bind:this={faultHistoryModal} />
<PrintHistoryModal bind:this={printHistoryModal} />