<script lang="ts">
	import { ArrowLeft } from "svelte-heros-v2";
	import type { PageData, PageServerData } from "./$types";
	import { getMostRecentChangeDateName, prettyDate, totalAllChanges, type InventoryChange } from "$lib/types/database";
	import ChangeLogTable from "$lib/components/tables/ChangeLogTable.svelte";


  export let data: PageServerData;
  const { session, singleItem } = data;


  function consumedPriorNumDays(changes: InventoryChange[], numDays: number) {
    const week = changes.filter(c => (new Date(c.created_at).getTime() > (Date.now() - 24 * 60 * 60 * numDays * 1000)) && c.amount < 0);
    return -week.flatMap(c => c.amount).reduce((p, c) => p + c, 0);
  }
</script>


<svelte:head>
    <title>Inventory</title>
</svelte:head>

<div class="flex flex-col gap-12 lg:my-12 w-full">
    <div class="relative overflow-hidden flex flex-row justify-between items-center bg-neutral rounded-2xl p-12 shadow-lg">
        <a href="/inventory" class="btn btn-outline uppercase text-xl font-light"><ArrowLeft class="inline" strokeWidth={'2px'} /><span class="ml-4 align-middle">Inventory</span></a>
        <span class="text-5xl font-thin">Single Item View</span>
    </div>
    <div class="flex flex-row justify-between bg-neutral rounded-2xl overflow-hidden p-12 shadow-lg">
      <div class="flex flex-col justify-between items-start space-y-12 z-10">
          <div class="flex flex-col space-y-2">
              <span class="text-5xl font-thin">{singleItem.name}</span>
              <span class="text-2xl">Matte Black</span>
          </div>
          <div class="flex flex-row gap-4">
            <button class="btn btn-primary">Edit</button>
          </div>
      </div>
      <div class="flex flex-col space-y-12">
          <div class="stats bg-base-100 border-info/50 border backdrop-blur z-10">
              <div class="stat">
                <div class="stat-title">On Hand</div>
                <div class="stat-value font-mono text-2xl">{totalAllChanges(singleItem.changes)}</div>
                  
              </div>
              <div class="stat">
                  <div class="stat-title">Last Updated</div>
                  <div class="stat-value font-mono text-2xl">{singleItem.changes.length > 0 ? prettyDate(singleItem.changes[0].created_at) : '-'}</div>
              </div>
              <div class="stat">
                  <div class="stat-title">Updated By</div>
                  <div class="stat-value font-mono text-2xl">{singleItem.changes.length > 0 ? singleItem.changes[0].created_by.full_name : '-'}</div>
              </div>
          </div>
          <div class="stats bg-base-100 border-info/50 border backdrop-blur z-10">
              <div class="stat">
                <div class="stat-title">Lower Limit</div>
                <div class="stat-value font-mono text-2xl">{singleItem.minimum}</div>
              </div>
              <div class="stat">
                  <div class="stat-title">Consumed (week)</div>
                  <div class="stat-value font-mono text-2xl">{consumedPriorNumDays(singleItem.changes, 7)}</div>
              </div>
              <div class="stat">
                  <div class="stat-title">Consumed (month)</div>
                  <div class="stat-value font-mono text-2xl">{consumedPriorNumDays(singleItem.changes, 28)}</div>
              </div>
          </div>
      </div>
  </div>

  <ChangeLogTable changes={singleItem.changes} />
</div>