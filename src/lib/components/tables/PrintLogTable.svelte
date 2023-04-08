<script lang="ts">
	import { getDateAndTime } from "$lib/helpers";
	import type { Print } from "$lib/types/database";
	import Paginate from "$lib/utilities/Paginate.svelte";
	import { onMount } from "svelte";

    export let prints: Print[] = [];
    let lowerIndex: number = 0;
    let upperIndex: number = 0;

    onMount(() => {
    })
</script>

<!-- Fault table -->
<div class="flex flex-col space-y-4">
    <div class="flex flex-row justify-start items-center">
        <div class="prose"><h2>Print Log</h2></div>
        <div class="divider divider-horizontal"></div>
        <div class="grow">{prints.length} Entries</div>
        <Paginate totalRows={prints.length} bind:lowerIndex bind:upperIndex />
    </div>
    {#if lowerIndex !== undefined && upperIndex !== undefined}
    <table class="table table-compact shadow-lg">
        <thead>
            <tr>
                <th>Date</th>
                <th>Created By</th>
                <th>Hours</th>
                <th>Consumed</th>
                <th>Cancelled</th>
                <th>Cancelled By</th>
                <th>Cancelled At</th>
            </tr>
        </thead>
        <tbody>
            {#each prints as print, i}
                <tr>
                    <td>{getDateAndTime(print.created_at)}</td>
                    <td>{print.created_by.full_name}</td>
                    <td>
                        {((new Date(print.done_at).getTime() - new Date(print.created_at).getTime()) / 1000 / 60 / 60).toFixed(2)}
                    </td>
                    <td>{print.filament}g</td>
                    <td>{print.cancelled}</td>
                    <td>{print.cancelled_by?.full_name ?? '-'}</td>
                    <td>{getDateAndTime(print.cancelled_at)}</td>
                </tr>
            {/each}
        </tbody>
    </table>
    {/if}
</div>