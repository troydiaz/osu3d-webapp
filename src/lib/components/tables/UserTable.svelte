<script lang="ts">
  import { goto } from "$app/navigation";
  import { PermCategory, PermFlag, getDateAndTime, hasPermission } from "$lib/helpers";
  import type { UserLevel } from "$lib/types/database";
  import Paginate from "$lib/utilities/Paginate.svelte";
  import { ChevronDown } from "svelte-heros-v2";
  
  export let userLevels: (UserLevel & { checked: boolean, previousLevel: number })[];
  
  let filterText = '';
  $: filteredUsers = filterText.trim() !== '' ? userLevels.filter(u => u.full_name?.toLowerCase().includes(filterText.toLowerCase().trim()) || u.email?.toLowerCase().includes(filterText.toLowerCase().trim())) : userLevels;
  
  let lowerIndex: number = 0;
  let upperIndex: number = 0;
</script>

<div class="flex flex-col gap-12">
  <!-- Users table -->
  <div class="flex flex-col gap-4">
    <div class="flex flex-row justify-start items-center">
      <div class="font-thin text-3xl">User Accounts</div>
      <div class="divider divider-horizontal"></div>
      <div>{userLevels.length} Entries</div>
      <div class="divider divider-horizontal"></div>
      <div class="grow relative">
        <input class="input input-sm w-full" type="text" placeholder="Filter by name or email..." bind:value={filterText} />
        <button class="btn btn-sm btn-ghost hover:bg-transparent absolute right-0 opacity-50" on:click={() => filterText = ''}>Clear</button>
      </div>
      <div class="divider divider-horizontal"></div>
      <Paginate pageSize={20} totalRows={filteredUsers.length} bind:lowerIndex bind:upperIndex />
    </div>
    {#if lowerIndex !== undefined && upperIndex !== undefined}
    <div class="window !p-0">
      <table class="table">
        <thead>
          <tr>
            <th></th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Joined On <ChevronDown class="inline" size={'16px'} /></th>
            <th>Last Update</th>
            <th>Permission Flags</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredUsers.slice(lowerIndex, upperIndex) as user, index}
          <tr class="transition {user.checked ? 'bg-success text-success-content' : ''}">
            <td class="grid grid-cols-3 gap-1">
                {#if hasPermission(user.level, PermCategory.TIER_3, PermFlag.FIRST)}
                <span class="px-1 py-1 font-mono bg-error text-error-content rounded-lg text-xs">TIER 3</span>
                {/if}
                {#if hasPermission(user.level, PermCategory.TIER_2, PermFlag.FIRST)}
                <span class="px-1 py-1 font-mono bg-warning text-warning-content rounded-lg text-xs">TIER 2</span>
                {/if}
                {#if hasPermission(user.level, PermCategory.TIER_1, PermFlag.FIRST)}
                <span class="px-1 py-1 font-mono bg-info text-info-content rounded-lg text-xs">TIER 1</span>
                {/if}
                {#if hasPermission(user.level, PermCategory.INVENTORY, PermFlag.FIRST)}
                <span class="px-1 py-1 font-mono bg-primary text-primary-content rounded-lg text-xs">INV.</span>
                {/if}
                {#if hasPermission(user.level, PermCategory.MAINTENANCE, PermFlag.FIRST)}
                <span class="px-1 py-1 font-mono bg-primary text-primary-content rounded-lg text-xs">MAINT.</span>
                {/if}

                {#if hasPermission(user.level, PermCategory.MACHINES, PermFlag.FIRST)}
                <span class="px-1 py-1 font-mono bg-primary text-primary-content rounded-lg text-xs">MACH.</span>
                {/if}

                {#if hasPermission(user.level, PermCategory.SPECIAL, PermFlag.FIRST)}
                <span class="px-1 py-1 font-mono bg-secondary text-secondary-content rounded-lg text-xs">ADMIN</span>
                {/if}
            </td>
            <td>{user.full_name}</td>
            <td>{user.email}</td>
            <td>{getDateAndTime(user.created_at)}</td>
            <td>{getDateAndTime(user.updated_at)}</td>
            <td>
              <button class="btn btn-sm btn-primary" on:click={() => goto(`/users/${user.user_id}`)} disabled={hasPermission(user.level, PermCategory.SPECIAL, PermFlag.FIRST)}>Edit Flags</button>
            </td>
          </tr>
          {/each}
        </tbody>
      </table>
    </div>
    {/if}
  </div>
</div>