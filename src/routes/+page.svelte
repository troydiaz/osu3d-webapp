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
            button: 'btn btn-primary bg-opacity-50 border-opacity-0 auth-button',
            input: 'input',
            label: 'label',
            container: '',
            divider: 'py-4'
        },
        style: {
            container: 'background-size: 5px 5px;'
        }
    } as Appearance

    onMount(() => console.log(data.url));
</script>

<svelte:head>
    <title>3D Print Club</title>
</svelte:head>


<div class="h-screen w-screen">
    <div class="flex flex-col justify-start items-center gap-8 p-12 md:gap-12 w-full h-full md:max-w-screen-sm mx-auto">
        <img src="osu3d.svg" class="w-32 h-32">
        <div>
            <div class="font-thin text-xl md:text-3xl text-center">3D Printing and<br>Additive Manufacturing Club</div>
            <div class="divider w-full max-w-sm mx-auto my-0"></div>
            <div class="font-light text-xl md:text-3xl text-center">Oregon State University</div>
        </div>
        <Auth
            providers={['google']}
            supabaseClient={data.supabase}
            redirectTo={`${data.url}/logging-in?redirect=/dashboard`}
            showLinks={false}
            theme="minimal"
            appearance={customTheme}
            onlyThirdPartyProviders={true}
            additionalData={{}}
        />
        <div class="grow"></div>
        <div class="text-xs p-2 rounded-lg bg-neutral">
            <div class="text-sm text-center">Notice</div>
            <div class="divider m-0"></div>
            User authentication is handled by Google through Social Sign On (SSO).
            Only your account name and email address is recorded by this system.
        </div>
    </div>
    <div class="absolute bottom-0 footer py-2 footer-center text-sm">
            {appName} {appVersion}
    </div>
</div>