<script lang="ts">
    import "../app.css";
    import { invalidate } from "$app/navigation";
    import { onMount } from "svelte";
    import type { LayoutData } from "./$types";

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

<div class="container mx-auto">
    <slot />
</div>