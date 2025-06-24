import type { Fault, Machine, User, UserPermissions } from '$lib/types/models';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params, locals: { supabase, getSession } }) => {
  const session = await getSession();
  if (!session) throw redirect(303, '/');

  return { session };
}) satisfies PageServerLoad;
