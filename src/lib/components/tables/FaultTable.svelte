<script lang="ts">
	import { getDateAndTime } from "$lib/helpers";
	import type { Fault } from "$lib/types/database";
	import Paginate from "$lib/utilities/Paginate.svelte";

    $: selectedRows = faults.filter(f => f.checked);
    $: resolveButtonText = ('Resolve ' + (selectedRows.length > 0 ? (selectedRows.length > 1 ? selectedRows.length + ' entries' : ' entry') : ' entry')).trim();

    export let faults: (Fault & { checked: boolean })[];

    $: if (faults) {
        console.log(faults);
    }

    let lowerIndex: number = 0;
    let upperIndex: number = 0;
</script>

<!-- Fault table -->
<div class="flex flex-col space-y-4">
    <div class="flex flex-row justify-start items-center">
        <div class="prose"><h2>Fault Log</h2></div>
        <div class="divider divider-horizontal"></div>
        <div>{faults.length} Entries Total</div> 
        <div class="divider divider-horizontal"></div>
        <form id="fault-resolve-form" method="POST" action="?/resolveFaultsMulti"></form>
        <input type="hidden" form="fault-resolve-form" name="idArray" value={JSON.stringify(faults.filter(f => f.checked).map(f => f.id))} />
        <button class="btn btn-sm btn-success" form="fault-resolve-form" type="submit" disabled={faults.filter(f => f.checked).length === 0}>{resolveButtonText}</button>
        <div class="grow"></div>
        <Paginate totalRows={faults.length} bind:lowerIndex bind:upperIndex />
    </div>
    {#if lowerIndex !== undefined && upperIndex !== undefined}
    <table class="table table-compact min-w-full shadow-lg bg-neutral overflow-hidden">
        <thead>
            <tr>
                <th></th>
                <th>Date</th>
                <th>Created By</th>
                <th>Description</th>
                <th>Resolved</th>
                <th>Resolved By</th>
                <th>Resolved At</th>
            </tr>
        </thead>
        <tbody>
            {#each faults.slice(lowerIndex, upperIndex) as fault, i}
                <tr class="transition {fault.checked ? 'bg-success text-success-content' : 'bg-neutral text-neutral-content'}" class:cursor-pointer={!fault.resolved} on:click={() => fault.resolved ? null : fault.checked = !fault.checked}>
                    <td><input type="checkbox" class="checkbox bg-base-100 disabled:bg-opacity-25 align-middle" bind:checked={fault.checked} disabled={fault.resolved} /></td>
                    <td>{getDateAndTime(fault.created_at)}</td>
                    <td>{fault.created_by.full_name}</td>
                    <td>
                        <div class="tooltip before:whitespace-pre-wrap before:content-[attr(data-tip)]" data-tip={fault.description}>
                            <span class="w-32 max-w-32 truncate inline-block text-start">{fault.description}</span>
                        </div>
                    </td>
                    <td><code class="bg-base-300 p-1 rounded-lg {!fault.resolved ? 'bg-error text-error-content' : ''}">{fault.resolved}</code></td>
                    <td>{fault.resolved_by?.full_name || '-'}</td>
                    <td>{getDateAndTime(fault.resolved_at)}</td>
                </tr>
            {/each}
        </tbody>
    </table>
    {/if}
</div>