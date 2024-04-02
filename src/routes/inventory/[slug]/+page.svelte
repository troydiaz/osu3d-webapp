<script lang="ts">
  import type { PageServerData } from "./$types";
  import { prettyDate, totalAllChanges, type InventoryChange } from "$lib/types/models";
  import ChangeLogTable from "$lib/components/tables/ChangeLogTable.svelte";
  import box from '$lib/images/package.png';
  import PageHeader from "$lib/components/PageHeader.svelte";

  export let data: PageServerData;
  const { singleItem } = data;

  function consumedPriorNumDays(changes: InventoryChange[], numDays: number) {
    const week = changes.filter(c => (new Date(c.created_at).getTime() > (Date.now() - 24 * 60 * 60 * numDays * 1000)) && c.amount < 0);
    return -week.flatMap(c => c.amount).reduce((p, c) => p + c, 0);
  }
</script>


<svelte:head>
  <title>Inventory | OSU 3D</title>
</svelte:head>

<div class="page">
  <PageHeader name="Edit Inventory" backUrl="/inventory" />
  <div class="window flex !flex-col md:!flex-row justify-between md:!p-8">
    <div class="flex flex-col justify-between items-start space-y-12 z-10">
      <div class="flex flex-col space-y-2">
        <span class="text-3xl font-thin">{singleItem.name}</span>
        <span class="text-base sm:text-2xl font-thin">{singleItem.inv_category.name}</span>
      </div>
      <div class="flex flex-row gap-4">
        <!-- <button class="btn btn-outline">Adjust Lower Limit</button>
        <button class="btn btn-outline">Edit Details</button> -->
      </div>
    </div>
    <div class="flex flex-col space-y-12">
      <div class="stats z-10">
        <div class="stat">
          <div class="stat-title sm:text-sm">On Hand</div>
          <div class="stat-value font-light tracking-wide text-base sm:text-2xl">{totalAllChanges(singleItem.changes)}</div>
        </div>
        <div class="stat">
          <div class="stat-title sm:text-sm">Last Updated</div>
          <div class="stat-value font-light tracking-wide text-base sm:text-2xl">{singleItem.changes.length > 0 ? prettyDate(singleItem.changes[0].created_at) : '-'}</div>
        </div>
        <div class="stat">
          <div class="stat-title sm:text-sm">Updated By</div>
          <div class="stat-value font-light tracking-wide text-base sm:text-2xl">{singleItem.changes.length > 0 ? singleItem.changes[0].created_by.full_name : '-'}</div>
        </div>
      </div>
      <div class="stats bg-base-100 z-10">
        <div class="stat">
          <div class="stat-title sm:text-sm">Lower Limit</div>
          <div class="stat-value font-light tracking-wide text-base sm:text-2xl">{singleItem.minimum}</div>
        </div>
        <div class="stat">
          <div class="stat-title sm:text-sm">Consumed (week)</div>
          <div class="stat-value font-light tracking-wide text-base sm:text-2xl">{consumedPriorNumDays(singleItem.changes, 7)}</div>
        </div>
        <div class="stat">
          <div class="stat-title sm:text-sm">Consumed (month)</div>
          <div class="stat-value font-light tracking-wide text-base sm:text-2xl">{consumedPriorNumDays(singleItem.changes, 28)}</div>
        </div>
      </div>
    </div>
  </div>

  <ChangeLogTable changes={singleItem.changes} />
</div>