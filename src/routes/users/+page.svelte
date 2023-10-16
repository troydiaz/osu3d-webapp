<script lang="ts">
  import type { ActionData, PageData } from './$types';
  import UserTable from '$lib/components/tables/UserTable.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import ledger from '$lib/images/orange_book.png';

  export let data: PageData;
  export let form: ActionData;

  let { userLevels } = data;
</script>

<svelte:head>
  <title>Members | OSU 3D</title>
</svelte:head>

<div class="flex flex-col gap-12 w-full">
  <PageHeader name="Members" image={ledger} />
  {#if userLevels}
    <UserTable
      userLevels={userLevels.map((u) => {
        return { ...u, checked: false, previousLevel: u.level };
      })}
    />
  {/if}
</div>