import { invalidate } from '$app/navigation';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from '$lib/types/supabase';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import type { LayoutLoad } from './$types';
import { dev } from '$app/environment';
import { DEV_SUPABASE_URL, DEV_SUPABASE_ANON_KEY } from '$env/static/private';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
    depends('supabase:auth');

    const supabase = createSupabaseLoadClient<Database>({
        supabaseUrl: dev ? DEV_SUPABASE_URL : PUBLIC_SUPABASE_URL,
        supabaseKey: dev ? DEV_SUPABASE_ANON_KEY : PUBLIC_SUPABASE_ANON_KEY,
        event: { fetch },
        serverSession: data.session
    });

    const {
        data: { session }
    } = await supabase.auth.getSession();

    const { data: userLevel } = session?.user.id ? await supabase
        .from('user_levels')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle() : { data: null };

    return { supabase, session, userLevel: userLevel };
};