import type { User, UserLevel } from "$lib/types/database";
import { error, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { hasPermission, PermCategory, PermFlag } from "$lib/helpers";

export const load = (async ({ params, locals: { supabase, getSession, getPermissions } }) => {
  const session = await getSession();
  const permissions = await getPermissions();

  if (!session || !hasPermission(permissions?.level, PermCategory.USERS, PermFlag.FIRST))
      throw redirect(303, '/');

  const { data: user } = await supabase
    .from('user_levels')
    .select('*')
    .eq('user_id', params.slug)
    .returns<UserLevel[]>()
    .maybeSingle();

  if (!user)
    throw error(404, 'User not found');

  return { session, user, slug: params.slug }
}) satisfies PageServerLoad;

export const actions = {
	setPerms: async ({ request, locals: { supabase, getSession } }) => {
    const formData = await request.formData();

    const admin = (formData.get('admin') as number | null) ?? 0;
    const inventory = (formData.get('inventory') as number | null) ?? 0;
    const maintenance = (formData.get('maintenance') as number | null) ?? 0;
    const machines = (formData.get('machines') as number | null) ?? 0;
    const tier3 = (formData.get('tier3') as number | null) ?? 0;
    const tier2 = (formData.get('tier2') as number | null) ?? 0;
    const tier1 = (formData.get('tier1') as number | null) ?? 0;

    // Special tier 99 (bambu labs tier 1.5)
    const tier99 = (formData.get('tier99') as number | null) ?? 0;
    // Special tier 98 (snapmaker tier 2.5)
    const tier98 = (formData.get('tier98') as number | null) ?? 0;

    const userId = formData.get('user_id') as string | null;

    if (!userId)
      throw error(404, 'No user ID');

    const perms = admin | inventory | maintenance | machines | tier3 | tier2 | tier1 | tier99 | tier98;

    const result = await supabase
      .from('user_levels')
      .update({
        level: perms,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .single();

    return {
      success: result.status === 200 || result.status === 204
    }

  }
} satisfies Actions;