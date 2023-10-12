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
  import ledger from '$lib/images/ledger.png';
  import hammer from '$lib/images/hammer.png';
  import printer from '$lib/images/printer.png';
  import door from '$lib/images/door.png';
	import SidebarButton from "$lib/components/SidebarButton.svelte";
  import sun from '$lib/images/sun.png';
  import moon from '$lib/images/moon.png';
	import { page } from "$app/stores";
  
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

<main class="bg-gradient-to-b from-base-100 to-slate-100 dark:from-base-200 dark:to-slate-900">
  {#if data.session}
  <!-- Notification Tray -->
  
  <AlertTray showAlerts={showAlerts} />
  
  <div class="drawer lg:drawer-open">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <div class="lg:hidden w-full bg-base-100 navbar flex-row justify-between space-x-4">
        <label for="my-drawer-2" class="btn btn-square btn-ghost drawer-button lg:hidden"><Bars3 color={'black'} /></label>
        osu3d-webapp
      </div>
      
      <div class="container lg:max-w-screen-lg lg:ml-16">
        
        <!-- Alerts -->
        <div class="fixed bottom-0 right-0 p-12 lg:max-w-screen-sm w-full flex flex-col items-center justify-start mt-12 gap-4 z-20">
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
      <div class="flex flex-col items-start justify-start">
        <slot />
      </div>
    </div>
  </div> 
  
  <div class="z-20 drawer-side overflow-visible">
    <label for="my-drawer-2" class="drawer-overlay"></label>
    <ul class="menu h-full px-4 bg-base-100 outline outline-1 outline-base-content/5">
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
                <button data-toggle-theme="light,dark" data-act-class="swap-active" class="swap group bg-gradient-to-b hover:rounded-r-none outline outline-1 outline-base-content/5 hover:from-blue-300 hover:to-blue-400 hover:dark:from-blue-500 hover:dark:to-blue-600">
                  <div class="swap-off"><img src={moon} class="opacity-50 w-10 h-10" /></div>
                  <div class="swap-on"><img src={sun} class="opacity-50 w-10 h-10" /></div>
                </button>
              </li>
            </SidebarTooltip>
            
            <!-- Logout Button -->
            <SidebarButton name="Logout" url="/logging-out" image={door} />
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