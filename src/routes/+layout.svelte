<script lang="ts">
  import "../app.css";
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import type { LayoutData } from "./$types";
  import { Bars3, InformationCircle, Moon, Sun } from "svelte-heros-v2";
  import { alerts, getAlertStyling } from '$lib/stores/alerts';
  import { slide } from "svelte/transition";
  import SidebarTooltip from "$lib/components/SidebarTooltip.svelte";
  import AlertTray from "$lib/components/AlertTray.svelte";
  import { PermCategory, PermFlag, hasPermission } from "$lib/helpers";
  import { themeChange } from 'theme-change';
  import rocket from '$lib/images/rocket.png';
  import gear from '$lib/images/gear.png';
  import box from '$lib/images/package.png';
  import ledger from '$lib/images/orange_book.png';
  import hammer from '$lib/images/hammer.png';
  import printer from '$lib/images/printer.png';
  import luggage from '$lib/images/luggage.png';
	import SidebarButton from "$lib/components/SidebarButton.svelte";
  import sun from '$lib/images/sun.png';
  import moon from '$lib/images/full_moon.png';
  
  export let data: LayoutData;
  let showAlerts = false;
  
  $: ({ supabase, userLevel } = data);
  
  
  onMount(() => {
    // Theme swap button
    themeChange(false);

    const { data } = supabase.auth.onAuthStateChange(() => {
      invalidate('supabase:auth')
    });
    
    return () => data.subscription.unsubscribe();
  });
</script>

<main>
  {#if data.session}
  <!-- Notification Tray -->
  
  <AlertTray showAlerts={showAlerts} />
  
  <div class="drawer lg:drawer-open">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content min-h-screen bg-gradient-to-bl from-base-100 to-slate-100 dark:from-black dark:to-slate-950">
      <div class="lg:hidden w-full z-20 bg-base-100 navbar sticky top-0 flex-row justify-between space-x-4 shadow outline outline-1 outline-base-content/10">
        <label for="my-drawer-2" class="btn btn-square btn-ghost drawer-button lg:hidden"><Bars3 color={'black'} /></label>
        <svg height="40px" width="40px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="512" cy="512" r="512" style="fill:#5865f2"></circle> <path d="M689.43 349a422.21 422.21 0 0 0-104.22-32.32 1.58 1.58 0 0 0-1.68.79 294.11 294.11 0 0 0-13 26.66 389.78 389.78 0 0 0-117.05 0 269.75 269.75 0 0 0-13.18-26.66 1.64 1.64 0 0 0-1.68-.79A421 421 0 0 0 334.44 349a1.49 1.49 0 0 0-.69.59c-66.37 99.17-84.55 195.9-75.63 291.41a1.76 1.76 0 0 0 .67 1.2 424.58 424.58 0 0 0 127.85 64.63 1.66 1.66 0 0 0 1.8-.59 303.45 303.45 0 0 0 26.15-42.54 1.62 1.62 0 0 0-.89-2.25 279.6 279.6 0 0 1-39.94-19 1.64 1.64 0 0 1-.16-2.72c2.68-2 5.37-4.1 7.93-6.22a1.58 1.58 0 0 1 1.65-.22c83.79 38.26 174.51 38.26 257.31 0a1.58 1.58 0 0 1 1.68.2c2.56 2.11 5.25 4.23 8 6.24a1.64 1.64 0 0 1-.14 2.72 262.37 262.37 0 0 1-40 19 1.63 1.63 0 0 0-.87 2.28 340.72 340.72 0 0 0 26.13 42.52 1.62 1.62 0 0 0 1.8.61 423.17 423.17 0 0 0 128-64.63 1.64 1.64 0 0 0 .67-1.18c10.68-110.44-17.88-206.38-75.7-291.42a1.3 1.3 0 0 0-.63-.63zM427.09 582.85c-25.23 0-46-23.16-46-51.6s20.38-51.6 46-51.6c25.83 0 46.42 23.36 46 51.6.02 28.44-20.37 51.6-46 51.6zm170.13 0c-25.23 0-46-23.16-46-51.6s20.38-51.6 46-51.6c25.83 0 46.42 23.36 46 51.6.01 28.44-20.17 51.6-46 51.6z" style="fill:#fff"></path> </g></svg>
      </div>
      
      <div class="container max-w-screen-md mx-auto lg:mx-0 lg:max-w-screen-lg lg:px-16">
        
        <!-- Alerts -->
        <div class="hidden lg:flex fixed top-0 right-0 p-12 lg:max-w-screen-sm w-full flex-col items-center justify-start gap-4 z-20">
          {#each $alerts as alert, index}
          <div in:slide={{ duration: 250 }} out:slide={{ duration: 250 }}
          class="alert shadow-lg w-full {getAlertStyling(alert.type)}"
          >
          <div class="flex flex-row justify-center items-center gap-4">
            <InformationCircle size={'56px'} />
            <div class="flex flex-col">
              <div class="text-2xl">{alert.header}</div>
              <div>{alert.message}</div>
            </div>
            <!-- <button class="btn btn-ghost btn-sm" on:click={() => deleteAlertId(alert.id)}>Dismiss</button> -->
          </div>
        </div>
        {/each}
      </div>
      
      <!-- Main app -->
      <div class="flex flex-col items-start justify-start h-full">
        <slot />
      </div>
    </div>
  </div> 
  
  <div class="z-20 drawer-side overflow-visible">
    <label for="my-drawer-2" class="drawer-overlay"></label>
    <ul class="menu h-full px-4 bg-base-100 outline outline-1 outline-base-content/10">
      <div class="h-full flex flex-col justify-start items-center gap-4 py-4">
        <div class="w-12">
          <img src="/osu3d.svg" class="m-auto opacity-75">
        </div>
        <div class="h-full flex flex-col justify-between mt-2">
          <div class="flex flex-col justify-start gap-2">
            <!-- Notifications -->
            <!-- <SidebarTooltip>
              <div slot="text" class="flex flex-col justify-center items-center h-full justify-self-end"><div class="">Notifications</div></div>
              <li>
                <a on:click={() => showAlerts = !showAlerts} class="flex-row justify-center items-center hover:bg-base-100 hover:rounded-r-none {$page.url.pathname.startsWith('/logging-out') ? 'bg-info text-info-content hover:!bg-info hover:!text-info-content' : 'text-red-400'}">
                  <Bell variation="solid" size="40px" />
                  <span class="z-50 badge badge-error font-bold badge-md absolute top-0 right-1 px-1 py-1">3</span>
                </a>
              </li>
            </SidebarTooltip> -->
            <div class="divider m-0"></div>

            <!-- Dashboard -->

            <SidebarButton name="Dashboard" url="/dashboard" image={rocket} />

            <!-- Account Settings -->
            <SidebarButton name="Settings" url="/account" image={gear} />

            <div class="divider m-0"></div>
            
            <!-- Machines -->
            {#if hasPermission(userLevel?.level, PermCategory.MACHINES, PermFlag.FIRST)}
            
            <SidebarButton name="Machines" url="/machines" image={printer} />
            {/if}
            
            <!-- Members -->
            {#if hasPermission(userLevel?.level, PermCategory.USERS, PermFlag.FIRST)}
            <SidebarButton name="Members" url="/users" image={ledger} />
            {/if}
            
            <!-- Inventory -->
            
            {#if hasPermission(userLevel?.level, PermCategory.INVENTORY, PermFlag.FIRST)}
            <SidebarButton name="Inventory" url="/inventory" image={box} />
            {/if}
            
            
            <!-- Maintenance -->
            {#if hasPermission(userLevel?.level, PermCategory.MAINTENANCE, PermFlag.FIRST)}
            <SidebarButton name="Maintenance" url="/maintenance" image={hammer} />
            {/if}
          </div>
          
          <div class="flex flex-col justify-start gap-2">
            <SidebarTooltip>
              <div slot="text" class="flex flex-col justify-center items-center h-full justify-self-end"><div class="">Theme</div></div>
              <li>
                <button data-toggle-theme="light,dark" data-act-class="swap-active" class="swap group bg-gradient-to-b hover:rounded-r-none outline outline-1 outline-base-content/10 hover:from-blue-300 hover:to-blue-400 hover:dark:from-blue-400 hover:dark:to-blue-500">
                  <div class="swap-off"><img src={moon} class="opacity-50 w-10 h-10" /></div>
                  <div class="swap-on"><img src={sun} class="opacity-50 w-10 h-10" /></div>
                </button>
              </li>
            </SidebarTooltip>
            
            <!-- Logout Button -->
            <SidebarButton name="Logout" url="/logging-out" image={luggage} />
          </div>
        </div>
      </div>
    </ul>
  </div>
</div>
{:else}
<slot />
{/if}
</main>

