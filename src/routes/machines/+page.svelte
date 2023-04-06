
<script lang="ts">
	import type { PageData } from "./$types";
    import { Bars3, Plus } from 'svelte-heros-v2';

    import { offset, flip, shift } from 'svelte-floating-ui/dom';
    import { createFloatingActions } from 'svelte-floating-ui';
    import type { ClientRectObject, VirtualElement } from 'svelte-floating-ui/core';
	import { writable } from "svelte/store";
	import type { Machine } from "./+page.server";


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
    let { session, machines, machineDefs } = data;

    $: if (machines) {
        console.log(machines);
    }

    let contextVisible = false;
    let contextMachine: Machine | null = null;

    let deleteModalVisible = false;
</script>

<div class="flex-col space-y-4">
    
    <div class="flex-row flex justify-start">
        <div class="prose">
            <h1 class="inline">Machines</h1>
        </div>
        <div class="divider divider-horizontal"></div>
        <button class="btn btn-primary" tabindex="-1">
            New Machine
            <!-- <Plus tabindex="-1" class="focus:outline-none" /> -->
        </button>
    </div>
    
    <div class="overflow-x-auto">
        <table class="table w-full">
            <thead>
                <tr>
                    <th>Machine ID</th>
                    <th>Type <span class="badge badge-info">F. Key</span></th>
                    <th>Tier</th>
                    <th>Nickname</th>
                    <th>Actions
                </tr>
            </thead>
            <tbody>
                {#each machines || [] as machine}
                <tr class="hover cursor-pointer" on:click={(event) => machineRowClicked(event, machine)}>
                    <td><code class="bg-base-200 rounded px-1">{machine.id}</code></td>
                    <td>{machine.machine_def.make} {machine.machine_def.model}</td>
                    <td>{machine.tier}</td>
                    <td>{machine.nickname}</td>
                    <td>
                        <button class="btn btn-square btn-ghost focus:outline-none">
                            <Bars3></Bars3>
                        </button>
                    </td>
                </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

{#if contextVisible && contextMachine}
<div use:floatingContent on:mouseleave={mouseLeaveContext} style="z-index: 99;" id="rightclickmenu">
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <ul class="menu shadow-lg bg-white rounded-box w-36">
        <li class="menu-title py-2 select-none"><span>{contextMachine.nickname}</span></li>
        <li><a on:click={() => console.log('lel')}>Edit</a></li>
        <li><a class="link-error" on:click={toggleDeleteModal}>Delete</a></li>
    </ul>
</div>
{/if}

<!-- The button to open modal -->
<label for="delete-machine-modal" class="btn">open modal</label>

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