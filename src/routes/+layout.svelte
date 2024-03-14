<script lang="ts">
  import "../app.css";
  import { goto, invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import { Bars3 } from "svelte-heros-v2";
  import SidebarTooltip from "$lib/components/SidebarTooltip.svelte";
  import { PermCategory, PermFlag, hasPermission } from "$lib/helpers";
  import { themeChange } from 'theme-change';
	import SidebarButton from "$lib/components/SidebarButton.svelte";
  import sun from '$lib/images/sun.png';
  import { Toaster } from 'svelte-french-toast';
  import { dev } from "$app/environment";

  // Images
  import key from '$lib/images/key.png';
  import flashlight from '$lib/images/flashlight.png';
  import { Box, CirclePlay, Cog, Database, Home, LogOut, Megaphone, PieChart, Play, SunMoon, User, UserCircle, Users, Wrench } from "lucide-svelte";
      
  let showAlerts = false;
  
  export let data;
  let { supabase, permissions, session } = data
  $: ({ supabase, permissions, session } = data)

  onMount(() => {
    // Theme swap button
    themeChange(false);

    const { data } = supabase.auth.onAuthStateChange((event, _session) => {
      if (_session?.expires_at !== session?.expires_at)
        invalidate('supabase:auth')
    });
    
    return () => data.subscription.unsubscribe();
  });

  async function signOut() {
    await supabase.auth.signOut();
    goto('/');
  }
</script>

<main>
  {#if session}
    <!-- Notification Tray -->
    <!-- <AlertTray showAlerts={showAlerts} /> -->
    
    <div class="drawer lg:drawer-open">
      <input id="drawer-id" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content overflow-x-auto">

        <!-- Navbar for smaller screens -->
        <div class="lg:hidden z-20 bg-base-100 navbar fixed bottom-0 justify-between space-x-4 shadow border-t border-base-content/10">
          <label for="drawer-id" class="btn btn-square btn-ghost drawer-button lg:hidden"><Bars3 /></label>
          <a href="https://discord.gg/XE2vD4QY">
            <svg height="40px" width="40px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="512" cy="512" r="512" style="fill:#5865f2"></circle> <path d="M689.43 349a422.21 422.21 0 0 0-104.22-32.32 1.58 1.58 0 0 0-1.68.79 294.11 294.11 0 0 0-13 26.66 389.78 389.78 0 0 0-117.05 0 269.75 269.75 0 0 0-13.18-26.66 1.64 1.64 0 0 0-1.68-.79A421 421 0 0 0 334.44 349a1.49 1.49 0 0 0-.69.59c-66.37 99.17-84.55 195.9-75.63 291.41a1.76 1.76 0 0 0 .67 1.2 424.58 424.58 0 0 0 127.85 64.63 1.66 1.66 0 0 0 1.8-.59 303.45 303.45 0 0 0 26.15-42.54 1.62 1.62 0 0 0-.89-2.25 279.6 279.6 0 0 1-39.94-19 1.64 1.64 0 0 1-.16-2.72c2.68-2 5.37-4.1 7.93-6.22a1.58 1.58 0 0 1 1.65-.22c83.79 38.26 174.51 38.26 257.31 0a1.58 1.58 0 0 1 1.68.2c2.56 2.11 5.25 4.23 8 6.24a1.64 1.64 0 0 1-.14 2.72 262.37 262.37 0 0 1-40 19 1.63 1.63 0 0 0-.87 2.28 340.72 340.72 0 0 0 26.13 42.52 1.62 1.62 0 0 0 1.8.61 423.17 423.17 0 0 0 128-64.63 1.64 1.64 0 0 0 .67-1.18c10.68-110.44-17.88-206.38-75.7-291.42a1.3 1.3 0 0 0-.63-.63zM427.09 582.85c-25.23 0-46-23.16-46-51.6s20.38-51.6 46-51.6c25.83 0 46.42 23.36 46 51.6.02 28.44-20.37 51.6-46 51.6zm170.13 0c-25.23 0-46-23.16-46-51.6s20.38-51.6 46-51.6c25.83 0 46.42 23.36 46 51.6.01 28.44-20.17 51.6-46 51.6z" style="fill:#fff"></path> </g></svg>
          </a>
        </div>
        
        <div class="container lg:px-16">
          <!-- Main app -->
          <div class="flex flex-col items-start justify-start w-full h-full pb-32 md:pt-12 lg:pb-12">
            <slot />
          </div>
        </div>
      </div> 
    
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
                  <span slot="icon"><Database /></span>
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

                <!-- Members -->
                {#if hasPermission(permissions?.level, PermCategory.USERS, PermFlag.FIRST)}
                <SidebarButton name="Reports" url="/reports">
                  <span slot="icon"><PieChart /></span>
                </SidebarButton>
                {/if}
        
              </div>
              
              
              
              <!-- <div class="flex flex-col justify-start gap-2">
                <div class="relative">
                  <SidebarTooltip>
                    <li class="group h-14 flex justify-center items-center">
                      <div class="absolute inset-0 bg-gradient-to-b rounded-md transition-none from-blue-300 to-blue-400 dark:from-blue-400 dark:to-blue-500 group-hover:opacity-100 opacity-0 rounded-r-none"></div>
                      
                      <button data-toggle-theme="light,night" data-act-class="swap-active" class="disable-focus h-14 py-1 group swap rounded-md group-hover:rounded-r-none transition-colors duration-100 !bg-transparent">
                        <div class="swap-off"><img src={sun} alt="Enter dark mode" class="opacity-75 h-12 group-hover:opacity-100 group-hover:scale-110 group-hover:drop-shadow shadow-black transition-all duration-300 ease-in-out" /></div>
                        <div class="swap-on"><img src={flashlight} alt="Enter light mode" class="opacity-75 h-12 group-hover:opacity-100 group-hover:scale-110 group-hover:drop-shadow shadow-black transition-all duration-300 ease-in-out" /></div>
                      </button>
                    </li>
                    <div slot="text" class="flex flex-col justify-center items-center h-full drop-shadow-lg shadow-black">Theme</div>
                  </SidebarTooltip>
                </div>
        
                <div class="relative">
                  <SidebarTooltip>
                    <li class="group h-14 flex justify-center items-center">
                      <div class="absolute inset-0 bg-gradient-to-b rounded-md transition-none from-blue-300 to-blue-400 dark:from-blue-400 dark:to-blue-500 group-hover:opacity-100 opacity-0 rounded-r-none"></div>
                      
                      <button on:click={() => signOut()} class="h-14 py-1 group disable-focus rounded-md group-hover:rounded-r-none">
                        <img src={key} alt="Logout" class="opacity-75 h-12 group-hover:opacity-100 group-hover:scale-105 group-hover:drop-shadow shadow-black transition duration-300 ease-in-out" />
                      </button>
                    </li>
                    <div slot="text" class="flex flex-col justify-center items-center h-full drop-shadow-lg shadow-black">Logout</div>
                  </SidebarTooltip>
                </div>
              </div> -->
            </div>
          </div>
        </ul>
      </div>
    </div>
  {:else}
    <slot />
  {/if}
</main>

<Toaster position="top-right" />

<div class="fixed inset-0 -z-10 pointer-events-none select-none blur-2xl">
  <img src="/bgdark2.jpg" class="h-full w-full" />
</div>