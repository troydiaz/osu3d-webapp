import type { Machine } from "$lib/types/database";
import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { fetchOneMachine } from "$lib/server/machine";

export const load = (async ({ params, locals: { supabase, getSession } }) => {
  const session = await getSession();
  if (!session) throw redirect(303, '/');

  const machine = await fetchOneMachine(supabase, params.slug);

  if (machine === null)
    throw error(404, 'Machine not found');

  return { session, machine, slug: params.slug }
}) satisfies PageServerLoad;

export const actions = {
  resolveFaultsMulti: async ({ request, locals: { supabase, getSession } }) => {
    const formData = await request.formData();
    const session = await getSession();

    const resolved_by_id = session?.user.id;
    if (!resolved_by_id) return { success: false };
    let resolveList: { id: string, success: boolean }[] = JSON.parse(formData.get('id-array') as string).map((id: string) => { return { id, success: false } });

    for (let job of resolveList) {
      const check = await supabase
        .from('faults')
        .select('*')
        .eq('id', job.id)
        .maybeSingle();

      if (check.data?.resolved)
        continue;

      const update = await supabase
        .from('machine_events')
        .update({
          resolved: true,
          resolved_by_user_id: resolved_by_id,
          resolved_at: new Date().toISOString()
        })
        .eq('id', job.id)
        .select();

      job.success = update.status === 200;
    }

    return {
      success: resolveList.filter(j => !j.success).length === 0
    }
  }
} satisfies Actions;