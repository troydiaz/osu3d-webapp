import {
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_URL_DEV,
    PUBLIC_SUPABASE_ANON_KEY
} from '$env/static/public';
import type { Database } from '$lib/types/supabase.js';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.supabase = createSupabaseServerClient<Database>({
        supabaseUrl: dev ? PUBLIC_SUPABASE_URL_DEV : PUBLIC_SUPABASE_URL,
        supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
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