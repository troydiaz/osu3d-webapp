<script lang="ts">
    import "../app.css";
    import { invalidate } from "$app/navigation";
    import { onMount } from "svelte";
    import type { LayoutData } from "./$types.js";
	import { ChartBar, Cog6Tooth, Cube, RocketLaunch, Users } from "svelte-heros-v2";

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
        <div class="drawer-content flex flex-col items-start justify-start ml-16 mt-16">
            <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">Open drawer</label>
            <!-- Page content here -->
            <slot />
        </div> 
        <div class="drawer-side">
            <label for="my-drawer-2" class="drawer-overlay"></label> 
            <ul class="menu p-4 w-80 bg-base-100 text-base-content">
            <!-- Sidebar content here -->
            <Cube size="64px" class="mx-auto" />
            <article class="prose mx-auto"><h1>osu 3d</h1></article>
            <div class="divider"></div>
            <li><a href="/dashboard" class="flex-row justify-between"><span><RocketLaunch class="inline mr-2" />Dashboard</span><span class="badge">new</span></a></li>
            <li><a href="/dashboard" class="flex-row justify-between"><span><Cog6Tooth class="inline mr-2" />Account</span></a></li>
            <div class="divider"></div>
            <li><a href="/machines"><span><ChartBar class="inline mr-2" />Machine Manager</span></a></li>
            <li><a href="/users" class="flex-row justify-between"><span><Users class="inline mr-2" />User Manager</span><span class="badge">37</span></a></li>
            </ul>
        </div>
    </div>
    {/if}
</main>


