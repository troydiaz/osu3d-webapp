<script lang="ts">
  import { ArrowLeft, Cog6Tooth } from 'svelte-heros-v2';
  import type { PageData, ActionData } from "./$types.js";
	import { onMount } from 'svelte';
	import { PermCategory, PermFlag, getPermCategory, getPermissionBit, hasPermission } from '$lib/helpers.js';
	import { addAlert, AlertTypeOld } from '$lib/stores/alerts.js';
	
  export let data: PageData;
  export let form: ActionData;

  $: if (form) form.success ? addAlert(AlertTypeOld.INFO, 'Good news', 'Changes saved successfully') : addAlert(AlertTypeOld.ERROR, 'Uh oh', 'There was an issue saving your settings');

  let { session, user } = data;
</script>

<div class="flex flex-col gap-12 lg:my-12 w-full">
  <div class="relative overflow-hidden flex flex-row justify-between items-center rounded-2xl p-8 shadow-lg bg-neutral">
    <a href="/users" class="btn btn-ghost btn-square uppercase text-xl font-light"><ArrowLeft size={'36px'} /></a>
    <div class="grow"></div>
    <span class="text-5xl font-thin pr-6">User Permissions</span>
    <Cog6Tooth size={'64px'} strokeWidth={'1px'} />
  </div>

  <div class="flex flex-col gap-4">
    <div class="font-thin text-3xl">Flags</div>
    <!-- Account Settings -->
    <div class="bg-neutral rounded-2xl p-8 w-full">

      <div class="flex flex-col">

        <div class="flex justify-between">
          <div class="flex flex-col gap-2 justify-end">
            <div>Name: { user.full_name }</div>
            <div>Email: { user.email }</div>
          </div>


          <form id="perm-form" method="post" action="?/setPerms">
            <div class="flex gap-2 justify-end mr-8 mt-32">
              <div class="flex flex-col gap-2 mr-4">
                <span class="uppercase font-mono -rotate-45 absolute -translate-y-24 -translate-x-3 text-left w-40">Admin</span>
                <input name="admin" checked={hasPermission(user.level, PermCategory.SPECIAL, PermFlag.FIRST)} value={getPermissionBit(PermCategory.SPECIAL, PermFlag.FIRST)} type="checkbox" class="checkbox checkbox-error" />
              </div>
              <div class="flex flex-col gap-2">
                <span class="uppercase font-mono -rotate-45 absolute -translate-y-24 -translate-x-3 text-left w-40">Inventory</span>
                <input name="inventory" checked={hasPermission(user.level, PermCategory.INVENTORY, PermFlag.FIRST)} value={getPermissionBit(PermCategory.INVENTORY, PermFlag.FIRST)} type="checkbox" class="checkbox checkbox-secondary" />
              </div>
              <div class="flex flex-col gap-2">
                <span class="uppercase font-mono -rotate-45 absolute -translate-y-24 -translate-x-3 text-left w-40">Maintenance</span>
                <input name="maintenance" checked={hasPermission(user.level, PermCategory.MAINTENANCE, PermFlag.FIRST)} value={getPermissionBit(PermCategory.MAINTENANCE, PermFlag.FIRST)} type="checkbox" class="checkbox checkbox-secondary" />
              </div>
              <div class="flex flex-col gap-2 mr-4">
                <span class="uppercase font-mono -rotate-45 absolute -translate-y-24 -translate-x-3 text-left w-40">Machines</span>
                <input name="machines" checked={hasPermission(user.level, PermCategory.MACHINES, PermFlag.FIRST)} value={getPermissionBit(PermCategory.MACHINES, PermFlag.FIRST)} type="checkbox" class="checkbox checkbox-secondary" />
              </div>
              <div class="flex flex-col gap-2">
                <span class="uppercase font-mono -rotate-45 absolute -translate-y-24 -translate-x-3 text-left w-40">Tier 3</span>
                <input name="tier3" checked={hasPermission(user.level, PermCategory.TIER_3, PermFlag.FIRST)} value={getPermissionBit(PermCategory.TIER_3, PermFlag.FIRST)} type="checkbox" class="checkbox checkbox-warning" />
              </div>
              <div class="flex flex-col gap-2">
                <span class="uppercase font-mono -rotate-45 absolute -translate-y-24 -translate-x-3 text-left w-40">Tier 2</span>
                <input name="tier2" checked={hasPermission(user.level, PermCategory.TIER_2, PermFlag.FIRST)} value={getPermissionBit(PermCategory.TIER_2, PermFlag.FIRST)} type="checkbox" class="checkbox checkbox-warning" />
              </div>
              <div class="flex flex-col gap-2">
                <span class="uppercase font-mono -rotate-45 absolute -translate-y-24 -translate-x-3 text-left w-40">Tier 1</span>
                <input name="tier1" checked={hasPermission(user.level, PermCategory.TIER_1, PermFlag.FIRST)} value={getPermissionBit(PermCategory.TIER_1, PermFlag.FIRST)} type="checkbox" class="checkbox checkbox-warning" />
              </div>
              <!-- Horizontal labels -->
              <div class="flex flex-col gap-2 ml-4">
                <div class="uppercase font-mono">ENABLED</div>
              </div>
            </div>

            <input type="hidden" name="user_id" value={user.user_id} />
          </form>

        </div>
          

        <div class="divider"></div>
        <div class="flex"><button type="submit" form="perm-form" class="btn">Save Changes</button></div>
      </div>

    </div>
  </div>
</div>