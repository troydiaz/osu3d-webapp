
<script lang="ts">
	import { onMount } from "svelte";
	import type { PageData } from "./$types.js";
    import { Bars3, Plus } from 'svelte-heros-v2';

    import { offset, flip, shift } from 'svelte-floating-ui/dom';
    import { createFloatingActions } from 'svelte-floating-ui';
    import type { ClientRectObject, VirtualElement } from 'svelte-floating-ui/core';
	import { writable } from "svelte/store";


    const [floatingRef, floatingContent] = createFloatingActions({
        strategy: 'absolute',
        placement: '',
        middleware: [
            offset(-25),
            flip(),
            shift()
        ]
    });

    let x = 0;
    let y = 0;

    function machineRowClicked(event: MouseEvent, machineId: string) {
        console.log('You clicke on table row with id', machineId);
        event.preventDefault();
        showTooltip = true;
        x = event.clientX;
        y = event.clientY;
    }

    const mouseleavecontext = (event: any) => {
        showTooltip = false;
    }

    $: getBoundingClientRect = (): ClientRectObject => {
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
    
    const virtualElement = writable<VirtualElement>({ getBoundingClientRect, contextElement: document.querySelector('#rightclickcontext') });
    $: virtualElement.set({ getBoundingClientRect });
    floatingRef(virtualElement);

    export let data: PageData;
    let { session, machines, machineDefs } = data;

    onMount(() => {
        console.log(machines);
    });

    let showTooltip = false;

</script>

<div class="flex-col space-y-4">
    
    <div class="flex-row flex justify-between items-end">
        <div class="prose">

            <h1 class="inline">Machines</h1>
        </div>

        <button class="btn btn-primary" tabindex="-1">
            <Plus tabindex="-1" class="focus:outline-none" />
        </button> 
    </div>
    
    <div class="overflow-x-auto">
        <table class="table w-full">
            <thead>
                <tr>
                    <th>Machine ID</th>
                    <th>Type  <span class="badge badge-info">F. Key</span></th>
                    <th>Tier</th>
                    <th>Nickname</th>
                    <th>Actions
                </tr>
            </thead>
            <tbody>
                {#each machines || [] as machine}
                <tr class="hover cursor-pointer" on:click={(event) => machineRowClicked(event, machine.id)}>
                    <td><code class="bg-base-200 rounded px-1">{machine.id}</code></td>
                    <td>{machine.machine_defs_id.make} {machine.machine_defs_id.model}</td>
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



{#if showTooltip}
<div use:floatingContent on:mouseleave={mouseleavecontext} style="z-index: 99;" id="rightclickmenu">
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <ul class="menu p-2 shadow bg-base-100 rounded-box w-36">
        <li><a on:click={() => console.log('lel')}>Edit</a></li>
        <li><a class="link-warning">Delete</a></li>
    </ul>
</div>
{/if}

<!-- The button to open modal -->
<label for="my-modal" class="btn">open modal</label>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="my-modal" class="modal-toggle" />
<div class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Congratulations random Internet user!</h3>
    <p class="py-4">You've been selected for a chance to get one year of subscription to use Wikipedia for free!</p>
    <div class="modal-action">
      <label for="my-modal" class="btn">Yay!</label>
    </div>
  </div>
</div>