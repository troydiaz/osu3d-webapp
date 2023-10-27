<script lang="ts">
	import { getDateAndTime } from "$lib/helpers";
	import type { Enums, Print } from "$lib/types/database";
	import Paginate from "$lib/utilities/Paginate.svelte";
	import { onMount } from "svelte";

    export let prints: Print[] = [];
    let lowerIndex: number = 0;
    let upperIndex: number = 0;

    function getStatusColor(status: Enums<'print_status'>) {
      switch (status) {
        case 'CANCELED':
          return 'bg-base-300/75 text-base-content';
        case 'WORKING':
          return 'bg-warning/75 text-warning-content';
        case 'SUCCESS':
          return 'bg-success/75 text-success-content';
        case 'FAULT':
          return 'bg-error/75 text-error-content';
      }
    }
</script>

<!-- Fault table -->
<div class="flex flex-col space-y-4">
    <div class="flex flex-row justify-start items-center">
        <div class="font-thin text-3xl">Print Log</div>
        <div class="divider divider-horizontal"></div>
        <div class="grow">{prints.length} Entries</div>
        <Paginate totalRows={prints.length} bind:lowerIndex bind:upperIndex />
    </div>
    {#if lowerIndex !== undefined && upperIndex !== undefined}
    <div class="window !p-0">
      <table class="table">
          <thead>
              <tr>
                  <th></th>
                  <th>Date</th>
                  <th>Created By</th>
                  <th>Hours</th>
                  <th>Consumed</th>
                  <th>Status</th>
                  <!-- <th>Canceled By</th>
                  <th>Canceled At</th> -->
              </tr>
          </thead>
          <tbody>
              {#each prints.slice(lowerIndex, upperIndex) as print, i}
                  <tr>
                      <td><input type="checkbox" class="checkbox checkbox-accent disabled:bg-opacity-25" disabled /></td>
                      <td>{getDateAndTime(print.created_at)}</td>
                      <td>{print.created_by.full_name}</td>
                      <td>
                          {((new Date(print.done_at).getTime() - new Date(print.created_at).getTime()) / 1000 / 60 / 60).toFixed(2)}
                      </td>
                      <td>{print.filament}g</td>
                      <td><code class="p-1 rounded-lg min-w-full uppercase {getStatusColor(print.status)}">{print.status}</code></td>
                      <!-- <td>{print.full_name ?? '—'}</td> -->
                      <!-- <td>{getDateAndTime(print.canceled_at)}</td> -->
                  </tr>
              {/each}
          </tbody>
      </table>
    </div>
    {/if}
</div>