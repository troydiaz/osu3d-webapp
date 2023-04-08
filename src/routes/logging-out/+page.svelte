<script lang="ts">
    import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
    import type { PageData } from './$types.js';

    export let data: PageData;

    onMount(async () => {
        await data.supabase.auth.signOut();
        goto('/');
    });
</script>