<script lang="ts">
	import { type InventoryChange, prettyDateTime } from "$lib/types/models";
	import Paginate from "$lib/utilities/Paginate.svelte";
	
  export let changes: InventoryChange[] = [];

  let lowerIndex: number = 0;
  let upperIndex: number = 0;
</script>

<!-- Machines table -->
<div class="flex flex-col gap-4">
  <div class="flex flex-row justify-start items-center">
      <div class="font-thin text-xl md:text-2xl">History</div>
      <div class="divider divider-horizontal"></div>
      <div class="grow">{changes.length} Entries</div>

      <div class="divider divider-horizontal"></div>
      <Paginate totalRows={changes.length} bind:lowerIndex bind:upperIndex />
  </div>
  
  <div class="window !p-0">
    <table class="table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Change</th>
                <th>Running Total</th>
                <th>Recorded By</th>
                <th class="text-end">Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each changes || [] as change}
            <tr>
                <td>
                  {prettyDateTime(change.created_at)}
                </td>
                <td>
                  {change.amount}
                </td>
                <td>
                  {change.running_total}
                </td>
                <td>
                  {change.created_by.full_name}
                </td>
                <td class="flex flex-row justify-end gap-2">
                  <button class="btn btn-sm btn-error" disabled>Delete</button>
                </td>
            </tr>
            {/each}
        </tbody>
    </table>
  </div>
</div>