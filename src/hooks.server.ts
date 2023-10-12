import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from '$lib/types/supabase.js';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { DEV_SUPABASE_URL, DEV_SUPABASE_ANON_KEY } from '$env/static/private';

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.supabase = createSupabaseServerClient<Database>({
        supabaseUrl: dev ? DEV_SUPABASE_URL : PUBLIC_SUPABASE_URL,
        supabaseKey: dev ? DEV_SUPABASE_ANON_KEY : PUBLIC_SUPABASE_ANON_KEY,
        event
    });

    event.locals.getSession = async () => {
        const {
            data: { session }
        } = await event.locals.supabase.auth.getSession();

        return session;
    };

    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            return name === 'content-range';
        }
    });
};