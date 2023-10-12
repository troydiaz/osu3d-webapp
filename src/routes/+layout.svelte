<script lang="ts">
  import "../app.css";
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import type { LayoutData } from "./$types";
  import { ArrowLeftOnRectangle, Bars3, Bell, Calendar, Cog6Tooth, CubeTransparent, InformationCircle, RocketLaunch, Users, Wrench } from "svelte-heros-v2";
  import { alerts, deleteAlertId, getAlertStyling } from '$lib/stores/alerts';
  import { slide } from "svelte/transition";
  import { page } from "$app/stores";
  import SidebarTooltip from "$lib/components/SidebarTooltip.svelte";
  import AlertTray from "$lib/components/AlertTray.svelte";
  import { PermCategory, PermFlag, hasPermission } from "$lib/helpers";
  
  export let data: LayoutData;
  let showAlerts = false;
  
  $: ({ supabase, userLevel } = data);
  
  
  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange(() => {
      invalidate('supabase:auth')
    });
    
    return () => data.subscription.unsubscribe();
  });
</script>

<main class="bg-gradient-to-b from-base-100 to-base-200">
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
    <ul class="menu h-full px-4 bg-base-300">
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
            <SidebarTooltip activeRoute={$page.url.pathname.startsWith('/dashboard')}>
              <div slot="text" class="flex flex-col justify-center items-center h-full"><div class="">Dashboard</div></div>
              <li>
                <a href="/dashboard" class="flex-row justify-center items-center hover:bg-base-100 hover:rounded-r-none {$page.url.pathname.startsWith('/dashboard') ? 'bg-info text-info-content hover:!bg-info hover:!text-info-content' : 'text-violet-400'}">
                  <RocketLaunch size="40px" />
                </a>
              </li>
            </SidebarTooltip>

            <!-- Account Settings -->
            <SidebarTooltip activeRoute={$page.url.pathname.startsWith('/account')}>
              <div slot="text" class="flex flex-col justify-center items-center h-full"><div class="">Settings</div></div>
              <li>
                <a href="/account" class="flex-row justify-center items-center hover:bg-base-100 hover:rounded-r-none {$page.url.pathname.startsWith('/account') ? 'bg-info text-info-content hover:!bg-info hover:!text-info-content' : 'text-white-400'}">
                  <Cog6Tooth size="40px" />
                </a>
              </li>
            </SidebarTooltip>
            
            <!-- Machines -->
            {#if hasPermission(userLevel?.level, PermCategory.MACHINES, PermFlag.FIRST)}
            <div class="divider m-0"></div>
            <SidebarTooltip activeRoute={$page.url.pathname.startsWith('/machines')}>
              <div slot="text" class="flex flex-col justify-center items-center h-full"><div class="">Machines</div></div>
              <li>
                <a href="/machines" class="flex-row justify-center items-center hover:bg-base-100 hover:rounded-r-none {$page.url.pathname.startsWith('/machines') ? 'bg-info text-info-content hover:!bg-info hover:text-info-content' : 'text-green-400'}">
                  <Wrench size="40px" />
                </a>
              </li>
            </SidebarTooltip>
            {/if}
            
            <!-- Members -->
            {#if hasPermission(userLevel?.level, PermCategory.USERS, PermFlag.FIRST)}
            <SidebarTooltip activeRoute={$page.url.pathname.startsWith('/users')}>
              <div slot="text" class="flex flex-col justify-center items-center h-full"><div class="">Members</div></div>
              <li>
                <a href="/users" class="flex-row justify-center items-center hover:bg-base-100 hover:rounded-r-none {$page.url.pathname.startsWith('/users') ? 'bg-info text-info-content hover:!bg-info hover:!text-info-content' : 'text-blue-400'}">
                  <Users size="40px" />
                  <!-- <span class="z-50 badge bg-info text-info-content font-bold badge-md absolute top-0 right-1 px-1 py-1">3</span> -->
                </a>
              </li>
            </SidebarTooltip> 
            {/if}
            
            <!-- Inventory -->
            {#if hasPermission(userLevel?.level, PermCategory.INVENTORY, PermFlag.FIRST)}
            <SidebarTooltip activeRoute={$page.url.pathname.startsWith('/inventory')}>
              <div slot="text" class="flex flex-col justify-center items-center h-full"><div class="">Inventory</div></div>
              <li>
                <a href="/inventory" class="flex-row justify-center items-center hover:bg-base-100 hover:rounded-r-none {$page.url.pathname.startsWith('/inventory') ? 'bg-info text-info-content hover:!bg-info hover:!text-info-content' : 'text-teal-400'}">
                  <CubeTransparent size="40px" />
                </a>
              </li>
            </SidebarTooltip>
            {/if}
            
            
            <!-- Maintenance -->
            {#if hasPermission(userLevel?.level, PermCategory.MAINTENANCE, PermFlag.FIRST)}
            <SidebarTooltip activeRoute={$page.url.pathname.startsWith('/maintenance')}>
              <div slot="text" class="flex flex-col justify-center items-center h-full"><div class="">Maintenance</div></div>
              <li>
                <a href="/maintenance" class="flex-row justify-center items-center hover:bg-base-100 hover:rounded-r-none {$page.url.pathname.startsWith('/maintenance') ? 'bg-info text-info-content hover:!bg-info hover:!text-info-content' : 'text-orange-400'}">
                  <Calendar size="40px" />
                </a>
              </li>
            </SidebarTooltip>
            {/if}
          </div>
          
          <div class="flex flex-col justify-start gap-2">
            
            <!-- Logout Button -->
            <SidebarTooltip activeRoute={$page.url.pathname.startsWith('/logging-out')}>
              <div slot="text" class="flex flex-col justify-center items-center h-full justify-self-end"><div class="">Logout</div></div>
              <li>
                <a href="/logging-out" class="flex-row justify-center items-center hover:bg-base-100 hover:rounded-r-none {$page.url.pathname.startsWith('/logging-out') ? 'bg-info text-info-content hover:!bg-info hover:!text-info-content' : 'text-red-400'}">
                  <ArrowLeftOnRectangle size="40px" />
                </a>
              </li>
            </SidebarTooltip>
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