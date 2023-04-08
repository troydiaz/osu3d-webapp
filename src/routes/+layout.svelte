<script lang="ts">
    import "../app.css";
    import { invalidate } from "$app/navigation";
    import { onMount } from "svelte";
    import type { LayoutData } from "./$types";
	import { ArrowLeftOnRectangle, Cog6Tooth, RocketLaunch, Users, Wrench } from "svelte-heros-v2";

    export let data: LayoutData;

    $: ({ supabase, userLevel } = data);


    onMount(() => {
        const { data } = supabase.auth.onAuthStateChange(() => {
            invalidate('supabase:auth')
        });

        console.log(userLevel);

        return () => data.subscription.unsubscribe();
    });
</script>

<main>
    {#if data.session}
    <div class="drawer drawer-mobile">
        <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col items-start justify-start">
            <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">Open drawer</label>
            <!-- Page content here -->
            <div class="p-16">
                <slot />
            </div>
        </div> 
        <div class="drawer-side">
            <label for="my-drawer-2" class="drawer-overlay"></label>
            <ul class="menu px-4 w-80 bg-base-100 text-base-content">
                <div class="max-w-full my-8 p-4 mx-auto aspect-square bg-emerald-300 shadow-md rounded-full">
                    <img src="osu3d.svg" class="w-24 m-auto">
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
                <!-- <li><a class="flex-row justify-between"><span><Users class="inline mr-2" />User Manager</span><span class="badge">3</span></a></li> -->
                {/if}
            </ul>
        </div>
    </div>
    {:else}
    <slot />
    {/if}
</main>