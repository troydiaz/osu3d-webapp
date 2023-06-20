<script lang="ts">
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import type { PageData } from './$types.js';

    export let data: PageData;

    $: {
        const redirectTo = $page.url.searchParams.get('redirect');

        // check if user has been set in session store, then redirect
        if (browser && data.session) {
            goto(redirectTo ?? '/dashboard');
        }
    };
</script>

<div class="flex flex-col items-center space-y-4 w-screen h-screen">
    <img src="osu3d.svg" class="w-64 h-64 my-8">
</div>