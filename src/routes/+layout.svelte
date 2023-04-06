<script lang="ts">
    import "../app.css";
    import { invalidate } from "$app/navigation";
    import { onMount } from "svelte";
    import type { LayoutData } from "./$types.js";
	import { ChartBar, Cog6Tooth, Cube, RocketLaunch, Users, Wrench } from "svelte-heros-v2";

    export let data: LayoutData;

    $: ({ supabase } = data);

    onMount(() => {
        const { data } = supabase.auth.onAuthStateChange(() => {
            invalidate('supabase:auth')
        });

        return () => data.subscription.unsubscribe();
    });
</script>

<svelte:head>
    <title>User management</title>
</svelte:head>


<main>
    {#if data.session}
    <div class="drawer drawer-mobile">
        <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col items-start justify-start">
            <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">Open drawer</label>
            <!-- Page content here -->
            <div class="ml-16 mt-16">
                <slot />
            </div>
        </div> 
        <div class="drawer-side">
            <label for="my-drawer-2" class="drawer-overlay"></label>
            <ul class="menu px-4 w-80 bg-base-100 text-base-content">
                <div class="max-w-full my-8 p-4 mx-auto aspect-square bg-base-300 shadow-md rounded-full">
                    <img src="osu3d.svg" class="w-24 m-auto">
                </div>
                <!-- Sidebar content here -->
                <!-- <Cube size="64px" class="mx-auto" /> -->
                

                <!-- <article class="prose mx-auto"><h1>osu 3d</h1></article> -->
                <!-- <div class="divider"></div> -->
                <li><a href="/dashboard" class="flex-row justify-between"><span><RocketLaunch class="inline mr-2" />Dashboard</span><span class="badge">new</span></a></li>
                <li><a href="/dashboard" class="flex-row justify-between"><span><Cog6Tooth class="inline mr-2" />My Account</span></a></li>
                <div class="divider"></div>
                <li class="menu-title"><span>Administrative</span></li>
                <li><a href="/machines"><span><Wrench class="inline mr-2" />Machine Manager</span></a></li>
                <li><a href="/users" class="flex-row justify-between"><span><Users class="inline mr-2" />User Manager</span><span class="badge">37</span></a></li>
            </ul>
        </div>
    </div>
    {:else}
    <slot />
    {/if}
</main>