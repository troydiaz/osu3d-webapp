<script lang="ts">
  import type { ActionData, PageData } from './$types';
  import UserTable from '$lib/components/tables/UserTable.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import ledger from '$lib/images/orange_book.png';

  export let data: PageData;

  let { userLevels } = data;
</script>

<svelte:head>
  <title>Members | OSU 3D</title>
</svelte:head>

<div class="page">
  <PageHeader name="Members" />
  {#if userLevels}
    <UserTable
      userLevels={userLevels.map((u) => {
        return { ...u, checked: false, previousLevel: u.level };
      })}
    />
  {/if}
</div>
