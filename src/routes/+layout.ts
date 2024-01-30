import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, PUBLIC_DEV_SUPABASE_ANON_KEY, PUBLIC_DEV_SUPABASE_URL } from '$env/static/public';
import type { LayoutLoad } from './$types';
import { dev } from '$app/environment';
import { createBrowserClient, isBrowser, parse } from '@supabase/ssr';
import type { Database } from '$lib/types/supabase';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
  depends('supabase:auth');
  
  const supabase = createBrowserClient<Database>(
    dev ? PUBLIC_DEV_SUPABASE_URL : PUBLIC_SUPABASE_URL,
    dev ? PUBLIC_DEV_SUPABASE_ANON_KEY : PUBLIC_SUPABASE_ANON_KEY, {
    global: {
      fetch
    },
    cookies: {
      get(key) {
        if (!isBrowser()) {
          return JSON.stringify(data.session);
        }

        const cookie = parse(document.cookie)
        return cookie[key]
      }
    }
  });

  const {
    data: { session }
  } = await supabase.auth.getSession();
  
  return {
    supabase,
    session,
    permissions: data.permissions
  };
}