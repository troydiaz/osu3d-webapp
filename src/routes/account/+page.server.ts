import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = (async ({ locals: { supabase, getSession } }) => {
  const session = await getSession();

  if (!session) {
    throw redirect(303, '/');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select(`email, full_name, discord, avatar_url`)
    .eq('user_id', session.user.id)
    .maybeSingle();

  return { session, profile };
}) satisfies PageServerLoad;

export const actions = {
  update: async ({ request, locals: { supabase, getSession } }) => {
    const formData = await request.formData();
    const full_name = formData.get('full_name') as string;
    const discord = formData.get('discord') as string;
    const avatar_url = formData.get('avatar_url') as string;

    console.log(full_name, discord, avatar_url);

    const session = await getSession();

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name,
        discord,
        avatar_url,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', session!.user.id);

    if (error !== null) {
      return fail(500, {
        full_name,
        discord,
        avatar_url,
        success: false
      });
    }

    return {
      full_name,
      discord,
      avatar_url,
      success: true
    };
  }
} satisfies Actions;
