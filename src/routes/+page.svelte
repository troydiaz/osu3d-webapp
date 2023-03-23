<script lang="ts">
    import { Auth } from '@supabase/auth-ui-svelte';
    import { ThemeSupa } from '@supabase/auth-ui-shared';
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<svelte:head>
    <title>User management</title>
</svelte:head>

<div class="flex flex-row justify-center">
    <div class="col-6 form-widget">
        <Auth
            providers={['google']}
            supabaseClient={data.supabase}
            redirectTo={`${data.url}/logging-in?redirect=/`}
            showLinks={false}
            appearance={{ theme: ThemeSupa, style: { input: 'color: #fff' } }}
        />
    </div>
</div>