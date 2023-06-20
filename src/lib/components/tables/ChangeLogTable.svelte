<script lang="ts">
	import { goto } from "$app/navigation";
	import { totalAllChanges, type InventoryItem, getMostRecentChangeDateName, type InventoryChange, prettyDate, prettyDateTime } from "$lib/types/database";
	import Paginate from "$lib/utilities/Paginate.svelte";
	import { Minus, Plus } from "svelte-heros-v2";
	import NewItemMenu from "../menu/NewItemMenu.svelte";

  export let changes: InventoryChange[] = [];

  let lowerIndex: number = 0;
  let upperIndex: number = 0;
</script>

<!-- Machines table -->
<div class="flex flex-col gap-4">
  <div class="flex flex-row justify-start items-center">
      <div class="font-thin text-3xl">History</div>
      <div class="divider divider-horizontal"></div>
      <div class="grow">{changes.length} Entries Total</div>

      <div class="divider divider-horizontal"></div>
      <Paginate totalRows={changes.length} bind:lowerIndex bind:upperIndex />
  </div>
  
  <table class="table shadow-lg bg-neutral overflow-hidden">
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
                <button class="btn btn-sm btn-success"><Plus /></button>
                <button class="btn btn-sm btn-error"><Minus /></button>
              </td>
          </tr>
          {/each}
      </tbody>
  </table>
</div>