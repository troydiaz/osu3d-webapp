<script lang="ts">
  import { dev } from "$app/environment";
  import { goto } from "$app/navigation";
  import SidebarButton from "$lib/components/SidebarButton.svelte";
  import { hasPermission, PermCategory, PermFlag } from "$lib/helpers";
  import type { UserPermissions } from "$lib/types/models";
  import type { Database } from '$lib/types/supabase';
  import type { SupabaseClient } from "@supabase/supabase-js";
  import { Box, PieChart, LogOut, UserCircle, Home, Cog, Play, Users, Wrench, Database as DBLucide } from "lucide-svelte";

  export let permissions: UserPermissions | null;
  export let supabase: SupabaseClient<Database>;
  export let name: string | null = null;

  async function signOut() {
    await supabase.auth.signOut();
    goto('/');
  }
</script>

<div class="z-20 drawer-side">
  <label for="drawer-id" class="drawer-overlay"></label>
  <ul class="overflow-y-auto menu h-full px-4 w-52 dark:bg-slate-400/10 bg-white/75 backdrop-blur-xl border-r border-black/10 dark:border-white/10">
    <div class="flex flex-col h-full w-full justify-stretch items-stretch gap-4">
      <!-- <div class="w-12">
        <img src="/osu3d.svg" alt="Club logo" class="m-auto opacity-75">
      </div> -->
      <div class="flex flex-col h-full w-full justify-between items-stretch gap-8 pt-4">
        <div class="flex flex-col justify-start md:gap-2 gap-2">

          <div class="flex flex-col w-full justify-center items-center gap-2 py-4">
            <UserCircle class="stroke-1 w-12 h-12" />
            {#if name}
              <span class="text-sm font-thin text-ellipsis whitespace-nowrap overflow-hidden w-full text-center">{ name }</span>
            {/if}
          </div>

          <div class="flex justify-center items-center gap-2 py-2">
            <div class="grow h-[1px] w-full dark:bg-white/10 bg-black/10"></div>
            <div class="text-xs font-light opacity-50 whitespace-nowrap">OSU 3D</div>
            <div class="grow h-[1px] w-full dark:bg-white/10 bg-black/10"></div>
          </div>

          <!-- Dashboard -->
          <SidebarButton name="Home" url="/dashboard">
            <span slot="icon"><Home /></span>
          </SidebarButton>
          <!-- Print -->
          <SidebarButton name="Print" url="/print">
            <span slot="icon"><Play /></span>
          </SidebarButton>
          <!-- Account Settings -->
          <SidebarButton name="Settings" url="/account">
            <span slot="icon"><Cog /></span>
          </SidebarButton>

          {#if hasPermission(permissions?.level, PermCategory.MACHINES, PermFlag.FIRST) || hasPermission(permissions?.level, PermCategory.INVENTORY, PermFlag.FIRST) || hasPermission(permissions?.level, PermCategory.MAINTENANCE, PermFlag.FIRST) && dev}
            <div class="flex justify-center items-center gap-2 py-2">
              <div class="grow h-[1px] w-full dark:bg-white/10 bg-black/10"></div>
              <div class="text-xs font-light opacity-50 whitespace-nowrap">Club Duties</div>
              <div class="grow h-[1px] w-full dark:bg-white/10 bg-black/10"></div>
            </div>
          {/if}

          <!-- Printers -->
          {#if hasPermission(permissions?.level, PermCategory.MACHINES, PermFlag.FIRST)}
          <SidebarButton name="Printers" url="/machines">
            <span slot="icon"><DBLucide /></span>
          </SidebarButton>
          {/if}

          <!-- Inventory -->
          {#if hasPermission(permissions?.level, PermCategory.INVENTORY, PermFlag.FIRST)}
          <SidebarButton name="Inventory" url="/inventory">
            <span slot="icon"><Box /></span>
          </SidebarButton>
          {/if}
  
          <!-- Maintenance -->
          {#if hasPermission(permissions?.level, PermCategory.MAINTENANCE, PermFlag.FIRST) && dev}
          <SidebarButton name="Maintenance" url="/maintenance">
            <span slot="icon"><Wrench /></span>
          </SidebarButton>
          {/if}

          

          {#if hasPermission(permissions?.level, PermCategory.USERS, PermFlag.FIRST)}
            <div class="flex justify-center items-center gap-2 py-2">
              <div class="grow h-[1px] w-full dark:bg-white/10 bg-black/10"></div>
              <div class="text-xs font-light opacity-50">Management</div>
              <div class="grow h-[1px] w-full dark:bg-white/10 bg-black/10"></div>
            </div>
          {/if}
  
          <!-- Members -->
          {#if hasPermission(permissions?.level, PermCategory.USERS, PermFlag.FIRST)}
          <SidebarButton name="Members" url="/users">
            <span slot="icon"><Users /></span>
          </SidebarButton>
          {/if}

          <!-- Reports -->
          {#if hasPermission(permissions?.level, PermCategory.SPECIAL, PermFlag.FIRST)}
          <SidebarButton name="Reports" url="/reports">
            <span slot="icon"><PieChart /></span>
          </SidebarButton>
          {/if}
  
        </div>

        <!-- Logout button -->
        <div class="pb-4">
          <div class="rounded-lg group transition hover:bg-base-content/10">
            <button on:click={() => signOut()} class="w-full h-full flex flex-row justify-start items-center transition text-error/75 gap-4 p-3 bg-opacity-50 group-hover:bg-opacity-100">
              <LogOut />
              <div class="font-semibold">Logout</div>
            </button>
          </div>
        </div>
        
      </div>
    </div>
  </ul>
</div>