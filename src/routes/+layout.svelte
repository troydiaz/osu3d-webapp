<script lang="ts">
    import "../app.css";
    import { invalidate } from "$app/navigation";
    import { onMount } from "svelte";
    import type { LayoutData } from "./$types";
	import { ArrowLeftOnRectangle, Bars3, Cog6Tooth, RocketLaunch, Users, Wrench } from "svelte-heros-v2";
    import { AlertType, alerts } from '$lib/stores/alerts';
	import { fade, scale } from "svelte/transition";

    export let data: LayoutData;

    $: ({ supabase, userLevel } = data);


    onMount(() => {
        const { data } = supabase.auth.onAuthStateChange(() => {
            invalidate('supabase:auth')
        });

        console.log('User level', userLevel);

        return () => data.subscription.unsubscribe();
    });
</script>

<main>
    {#if data.session}
    <div class="drawer drawer-mobile">
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
        <div class="drawer-side">
            <label for="my-drawer-2" class="drawer-overlay"></label>
            <ul class="menu px-4 w-80 bg-base-100 text-base-content">
                <div class="max-w-full my-8 p-4 mx-auto aspect-square bg-emerald-300 shadow-md rounded-full">
                    <img src="/osu3d.svg" class="w-24 m-auto">
                </div>
                <!-- Sidebar content here -->
                <!-- <Cube size="64px" class="mx-auto" /> -->
                

                <!-- <article class="prose mx-auto"><h1>osu 3d</h1></article> -->
                <!-- <div class="divider"></div> -->
                <li><a href="/dashboard" class="flex-row justify-between"><span><RocketLaunch class="inline mr-2" />Dashboard</span></a></li>
                <!-- <li><a href="/dashboard" class="flex-row justify-between"><span><Cog6Tooth class="inline mr-2" />My Account</span></a></li> -->
                <li><a href="/logging-out" class="flex-row justify-between"><span><ArrowLeftOnRectangle class="inline mr-2" />Signout</span></a></li>
                {#if userLevel?.level === -1}
                <div class="divider"></div>
                <li class="menu-title"><span>Administrative</span></li>
                <li><a href="/machines"><span><Wrench class="inline mr-2" />Machine Manager</span></a></li>
                <li><a href="/users"><span><Users class="inline mr-2" />User Manager</span></a></li>
                {/if}
            </ul>
        </div>
    </div>
    {:else}
    <slot />
    {/if}
</main>