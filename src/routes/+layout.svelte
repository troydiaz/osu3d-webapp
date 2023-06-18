<script lang="ts">
    import "../app.css";
    import { invalidate } from "$app/navigation";
    import { onMount } from "svelte";
    import type { LayoutData } from "./$types";
	import { ArrowLeftOnRectangle, Bars3, Cog6Tooth, Cube, CubeTransparent, RocketLaunch, Users, Wrench } from "svelte-heros-v2";
    import { AlertType, alerts } from '$lib/stores/alerts';
	import { scale } from "svelte/transition";
	import { page } from "$app/stores";
	import SidebarTooltip from "$lib/components/SidebarTooltip.svelte";

    export let data: LayoutData;

    $: ({ supabase, userLevel } = data);


    onMount(() => {
        const { data } = supabase.auth.onAuthStateChange(() => {
            invalidate('supabase:auth')
        });

        return () => data.subscription.unsubscribe();
    });
</script>

<main>
    {#if data.session}
    <div class="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
            <div class="lg:hidden w-full bg-base-100 navbar flex-row justify-between space-x-4">
                <label for="my-drawer-2" class="btn btn-square btn-ghost drawer-button lg:hidden"><Bars3 color={'black'} /></label>
                osu3d-webapp
            </div>

            <div class="container lg:max-w-screen-lg lg:ml-16">
                <div class="flex flex-col items-start justify-start">
                    <slot />
                </div>
            </div>


            <div class="absolute left-0 top-8 w-full" style="z-index: 100;">
                <div class="flex flex-col space-y-4">
                    {#each $alerts as alert, index}
                        <div in:scale={{ duration: 250 }} out:scale={{ duration: 250 }}
                            class="alert shadow-lg w-1/3 mx-auto {alert.type === AlertType.INFO ? 'bg-green-500' : 'alert-error'}"
                        >
                            <div class="flex flex-row justify-start items-center w-full">
                                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{alert.message}</span>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div> 
        <div class="drawer-side overflow-visible">
            <label for="my-drawer-2" class="drawer-overlay"></label>
            <ul class="menu h-full px-4 bg-base-300">
                <div class="h-full flex flex-col justify-start items-center gap-4 py-4">
                    <div class="w-12">
                        <img src="/osu3d.svg" class="m-auto opacity-75">
                    </div>
                    <div class="h-full flex flex-col justify-between">
                        <div class="flex flex-col justify-start gap-2">
                            <SidebarTooltip activeRoute={$page.url.pathname.startsWith('/dashboard')}>
                            <div slot="text" class="flex flex-col justify-center items-center h-full"><div class="">Dashboard</div></div>
                            <li>
                                    <a href="/dashboard" class="flex-row justify-center items-center hover:bg-base-100 hover:rounded-r-none {$page.url.pathname.startsWith('/dashboard') ? 'bg-info text-info-content hover:!bg-info hover:text-info-content' : 'text-violet-400'}">
                                        <RocketLaunch size="40px" />
                                    </a>
                            </li>
                            </SidebarTooltip>
                            <SidebarTooltip activeRoute={$page.url.pathname.startsWith('/account')}>
                            <div slot="text" class="flex flex-col justify-center items-center h-full"><div class="">Settings</div></div>
                            <li>
                                <a href="/account" class="flex-row justify-center items-center hover:bg-base-100 hover:rounded-r-none {$page.url.pathname.startsWith('/account') ? 'bg-info text-info-content hover:!bg-info hover:text-info-content' : 'text-white-400'}">
                                    <Cog6Tooth size="40px" />
                                </a>
                            </li>
                            </SidebarTooltip>
                    
                            {#if userLevel?.level === -1}
                            <div class="divider"></div>
                            <!-- <li class="menu-title"><span>Administrative</span></li> -->
                            <SidebarTooltip activeRoute={$page.url.pathname.startsWith('/machines')}>
                                <div slot="text" class="flex flex-col justify-center items-center h-full"><div class="">Machines</div></div>
                                <li>
                                    <a href="/machines" class="flex-row justify-center items-center hover:bg-base-100 hover:rounded-r-none {$page.url.pathname.startsWith('/machines') ? 'bg-info text-info-content hover:!bg-info hover:text-info-content' : 'text-green-400'}">
                                        <Wrench size="40px" />
                                    </a>
                                </li>
                            </SidebarTooltip>
                            <SidebarTooltip activeRoute={$page.url.pathname.startsWith('/users')}>
                                <div slot="text" class="flex flex-col justify-center items-center h-full"><div class="">Members</div></div>
                                <li>
                                    <a href="/users" class="flex-row justify-center items-center hover:bg-base-100 hover:rounded-r-none {$page.url.pathname.startsWith('/users') ? 'bg-info text-info-content hover:!bg-info hover:text-info-content' : 'text-blue-400'}">
                                        <Users size="40px" />
                                    </a>
                                </li>
                            </SidebarTooltip>

                            <!-- Inventory -->
                            <SidebarTooltip activeRoute={$page.url.pathname.startsWith('/inventory')}>
                                <div slot="text" class="flex flex-col justify-center items-center h-full"><div class="">Inventory</div></div>
                                <li>
                                    <a href="/inventory" class="flex-row justify-center items-center hover:bg-base-100 hover:rounded-r-none {$page.url.pathname.startsWith('/inventory') ? 'bg-info text-info-content hover:!bg-info hover:text-info-content' : 'text-teal-400'}">
                                        <CubeTransparent size="40px" />
                                    </a>
                                </li>
                            </SidebarTooltip>
                            {/if}
                        </div>

                        <!-- Logout Button -->
                        <SidebarTooltip activeRoute={$page.url.pathname.startsWith('/logging-out')}>
                            <div slot="text" class="flex flex-col justify-center items-center h-full justify-self-end"><div class="">Logout</div></div>
                            <li>
                                <a href="/logging-out" class="flex-row justify-center items-center hover:bg-base-100 hover:rounded-r-none {$page.url.pathname.startsWith('/logging-out') ? 'bg-info text-info-content hover:!bg-info hover:text-info-content' : 'text-red-400'}">
                                    <ArrowLeftOnRectangle size="40px" />
                                </a>
                            </li>
                        </SidebarTooltip>
                    </div>
                </div>
            </ul>
        </div>
    </div>
    {:else}
    <slot />
    {/if}
</main>