<script lang="ts">
  import { dev } from "$app/environment";
  import { goto } from "$app/navigation";
  import SidebarButton from "$lib/components/SidebarButton.svelte";
  import { hasPermission, PermCategory, PermFlag } from "$lib/helpers";
  import type { Permissions } from "$lib/types/models";
  import type { SupabaseClient } from "@supabase/supabase-js";
  import type { Database } from '$lib/types/supabase';
  import { Box, PieChart, LogOut, UserCircle, Home, Cog, Play, Users, Wrench, Database as DBLucide } from "lucide-svelte";

  export let permissions: Permissions | null;
  export let supabase: SupabaseClient<Database>;

  async function signOut() {
    await supabase.auth.signOut();
    goto('/');
  }
</script>

<div class="z-20 drawer-side overflow-visible">
  <label for="drawer-id" class="drawer-overlay"></label>
  <ul class="menu h-full w-52 px-4 dark:bg-slate-400/10 backdrop-blur-xl ring-1 ring-white/10">
    <div class="flex flex-col h-full justify-start items-stretch gap-4 py-4">
      <!-- <div class="w-12">
        <img src="/osu3d.svg" alt="Club logo" class="m-auto opacity-75">
      </div> -->
      <div class="flex flex-col h-full justify-between items-stretch">
        <div class="flex flex-col justify-start md:gap-2 gap-2">

          <div class="flex flex-col justify-center items-center gap-2 py-4">
            <UserCircle size={48} strokeWidth={1.5} />
            <div class="text-sm font-thin">Stephen Fike</div>
          </div>

          <div class="flex justify-center items-center gap-2 py-2">
            <div class="grow h-[1px] w-full bg-white/10"></div>
            <div class="text-xs font-light opacity-50 whitespace-nowrap">OSU 3D</div>
            <div class="grow h-[1px] w-full bg-white/10"></div>
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

          <div class="flex justify-center items-center gap-2 py-2">
            <div class="grow h-[1px] w-full bg-white/10"></div>
            <div class="text-xs font-light opacity-50 whitespace-nowrap">Club Duties</div>
            <div class="grow h-[1px] w-full bg-white/10"></div>
          </div>

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

          <div class="flex justify-center items-center gap-2 py-2">
            <div class="grow h-[1px] w-full bg-white/10"></div>
            <div class="text-xs font-light opacity-50">Management</div>
            <div class="grow h-[1px] w-full bg-white/10"></div>
          </div>
  
          <!-- Members -->
          {#if hasPermission(permissions?.level, PermCategory.USERS, PermFlag.FIRST)}
          <SidebarButton name="Members" url="/users">
            <span slot="icon"><Users /></span>
          </SidebarButton>
          {/if}

          <!-- Reports -->
          {#if hasPermission(permissions?.level, PermCategory.USERS, PermFlag.FIRST)}
          <SidebarButton name="Reports" url="/reports">
            <span slot="icon"><PieChart /></span>
          </SidebarButton>
          {/if}
  
        </div>

        <div class="grow"></div>

        <!-- Logout button -->
        <div class="relative rounded-lg group transition hover:bg-base-content/10">
          <button on:click={() => signOut()} class="w-full h-full flex flex-row justify-start items-center transition gap-4 p-3 opacity-30 group-hover:opacity-100">
            <LogOut />
            <div class="font-semibold">Logout</div>
          </button>
        </div>
        
      </div>
    </div>
  </ul>
</div>