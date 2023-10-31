<script lang="ts">
	import { getDateAndTime } from "$lib/helpers";
  import type { Enums, MachineEvent } from "$lib/types/database";
	import Paginate from "$lib/utilities/Paginate.svelte";
  import { getDate } from "date-fns";

  $: selectedIds = faults.filter(f => f.checked).map(f => f.id);

  export let faults: (MachineEvent & { checked: boolean })[];

  let lowerIndex: number = 0;
  let upperIndex: number = 0;

  function getEventTypeColor(status: Enums<'event_type'>) {
    switch (status) {
      case 'STOP':
        return 'bg-warning/75 text-warning-content';
      case 'FAULT':
        return 'bg-error/75 text-error-content';
    }
  }

  function getResolvedColor(resolved: boolean) {
    switch (resolved) {
      case true:
        return 'bg-success/75 text-success-content';
      case false:
        return 'bg-error/75 text-error-content';
    }
  }
</script>

<!-- Fault table -->
<div class="flex flex-col space-y-4">
    <div class="flex flex-row justify-start items-center window-header">
        <div class="font-thin text-3xl">Event Log</div>
        <div class="divider divider-horizontal hidden md:flex"></div>
        <div class="hidden md:block">{faults.length} Entries</div> 
        <div class="divider divider-horizontal hidden md:flex"></div>
        <form id="fault-resolve-form" method="POST" action="?/resolveFaultsMulti"></form>
        <input type="hidden" form="fault-resolve-form" name="id-array" value={JSON.stringify(selectedIds)} />
        <button class="btn btn-sm btn-success ml-4 md:ml-0" form="fault-resolve-form" type="submit" disabled={faults.filter(f => f.checked).length === 0}>Resolve</button>
        <div class="grow"></div>
        <Paginate totalRows={faults.length} bind:lowerIndex bind:upperIndex />
    </div>
    {#if lowerIndex !== undefined && upperIndex !== undefined}
    <div class="window !p-0">
      <table class="table">
          <thead>
              <tr>
                  <th></th>
                  <th>Date</th>
                  <th>Code</th>
                  <th class="hidden md:table-cell">Issued By</th>
                  <th>Description</th>
                  <th>Resolved</th>
                  <th class="hidden md:table-cell">Resolved By</th>
                  <th class="hidden md:table-cell">Resolved At</th>
              </tr>
          </thead>
          <tbody>
              {#each faults.slice(lowerIndex, upperIndex) as fault, i}
                  <tr class="transition {fault.checked ? 'bg-success text-success-content' : ''}" class:cursor-pointer={!fault.resolved} on:click={() => fault.resolved ? null : fault.checked = !fault.checked}>
                      <td><input type="checkbox" class="checkbox bg-base-100 disabled:bg-opacity-25 align-middle" bind:checked={fault.checked} disabled={fault.resolved} /></td>
                      <td><span class="hidden md:inline">{getDateAndTime(fault.created_at, true)}</span><span class="md:hidden">{getDateAndTime(fault.created_at, false)}</span></td>
                      <td><code class="p-1 rounded-lg uppercase {getEventTypeColor(fault.event_type)}">{fault.event_type}</code></td>
                      <td class="hidden md:table-cell">{fault.created_by?.full_name ?? '—'}</td>
                      <td>
                          <div class="tooltip before:whitespace-pre-wrap before:content-[attr(data-tip)]" data-tip={fault.description ?? '—'}>
                              <span class="w-32 max-w-32 truncate inline-block text-start">{fault.description ?? '—'}</span>
                          </div>
                      </td>
                      <td><code class="p-1 rounded-lg uppercase {getResolvedColor(fault.resolved)}">{fault.resolved}</code></td>
                      <td class="hidden md:table-cell">{fault.resolved_by?.full_name ?? '—'}</td>
                      <td class="hidden md:table-cell">{getDateAndTime(fault.resolved_at, true)}</td>
                  </tr>
              {/each}
          </tbody>
      </table>
    </div>
    {/if}
</div>