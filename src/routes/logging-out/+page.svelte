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

<section>
	"Because as we know, there are known knowns; there are things we know we know. We also know there
	are known unknowns; that is to say we know there are some things we do not know. But there are
	also unknown unknowns—the ones we don't know we don't know" - Donald Rumsfeld
</section>