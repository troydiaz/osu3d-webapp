import { invalidate } from '$app/navigation';
import {
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY
} from '$env/static/public';
import type { Database } from '$lib/types/supabase';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
    depends('supabase:auth');

    const supabase = createSupabaseLoadClient<Database>({
        supabaseUrl: PUBLIC_SUPABASE_URL,
        supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
        event: { fetch },
        serverSession: data.session
    });

    const {
        data: { session }
    } = await supabase.auth.getSession();

    return { supabase, session };
};