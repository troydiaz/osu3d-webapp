<script lang="ts">
    import { Auth } from '@supabase/auth-ui-svelte';
	import type { Appearance } from '@supabase/auth-ui-svelte/dist/types';
    import type { PageData } from './$types';
	import { onMount } from 'svelte';

    export let data: PageData;

    // @ts-ignore
    const appName = __NAME__;

    // @ts-ignore
    const appVersion = __VERSION__;

    const customTheme = {
        extend: false,
        className: {
            button: 'btn btn-secondary auth-button',
            input: 'input',
            label: 'label',
            container: 'p-4 bg-cover bg-top border-base-300 bg-base-100 rounded-box',
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
    <title>osu3d</title>
</svelte:head>


<div class="flex flex-col items-center space-y-4">
    <img src="osu3d.svg" class="w-64 h-64 my-8">
    <Auth
        providers={['google']}
        supabaseClient={data.supabase}
        redirectTo={`${data.url}/logging-in?redirect=/dashboard`}
        showLinks={false}
        theme="minimal"
        appearance={customTheme}
        onlyThirdPartyProviders={true}
    />

    <div class="text-sm">
        {appName} {appVersion}
    </div>
</div>