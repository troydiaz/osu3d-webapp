import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, PUBLIC_DEV_SUPABASE_ANON_KEY, PUBLIC_DEV_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/types/supabase.js';
import type { Handle } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import { dev } from '$app/environment';
import type { UserPermissions } from '$lib/types/models';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient<Database>(
    dev ? PUBLIC_DEV_SUPABASE_URL : PUBLIC_SUPABASE_URL,
    dev ? PUBLIC_DEV_SUPABASE_ANON_KEY : PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => event.cookies.get(key),
      set: (key, value, options) => {
        event.cookies.set(key, value, options);
      },
      remove: (key, options) => {
        event.cookies.delete(key, options);
      }
    }
  });
  
  event.locals.getSession = async () => {
    const {
      data: { session }
    } = await event.locals.supabase.auth.getSession();
    
    return session;
  };

  event.locals.getPermissions = async () => {
    const session = await event.locals.getSession();
    if (!session?.user.id) return null;

    const { data: userLevel } = await event.locals.supabase.from('user_levels')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle<UserPermissions>();

    return userLevel;
  }

  event.locals.getUserProfile = async () => {
    const session = await event.locals.getSession();
    if (!session?.user.id) return null;

    const { data: profile } = await event.locals.supabase.from('profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle();

    return profile;
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range';
    }
  });
};