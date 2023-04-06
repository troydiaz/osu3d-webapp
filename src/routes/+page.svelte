<script lang="ts">
    import { Auth } from '@supabase/auth-ui-svelte';
	import type { Appearance } from '@supabase/auth-ui-svelte/dist/types';
    import type { PageData } from './$types';
	import { onMount } from 'svelte';

    export let data: PageData;

    const customTheme = {
        extend: false,
        className: {
            button: 'btn btn-primary rounded my-button',
            input: 'input',
            label: 'label',
            container: 'p-4 bg-cover bg-top border-base-300 bg-base-300 rounded-box my-auth-container',
            divider: 'py-4'
        },
        style: {
            container: 'background-size: 5px 5px;'
        }
    } as Appearance

    onMount(() => {
        console.log(`${data.url}/logging-in?redirect=/dashboard`);
    })
</script>

<svelte:head>
    <title>User management</title>
</svelte:head>

<div class="flex flex-col justify-center my-auth h-full place-items-center">
        <Auth
            providers={['google']}
            supabaseClient={data.supabase}
            redirectTo={`${data.url}/logging-in?redirect=/dashboard`}
            showLinks={false}
            theme="minimal"
            appearance={customTheme}
        />
</div>

<style>
    .my-auth > .my-button {
        /* background-image: radial-gradient(hsla(var(--bc)/.2) .5px,hsla(var(--b2)/1) .5px) */
        border-radius: 10px !important;
    }
</style>
