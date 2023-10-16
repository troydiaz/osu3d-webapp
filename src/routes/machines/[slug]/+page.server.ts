import type { Machine } from "$lib/types/database";
import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async ({ params, locals: { supabase, getSession } }) => {
  const session = await getSession();

  if (!session)
    throw redirect(303, '/');

  const { data: machine } = await supabase
    .from('machines')
    .select(`
      *,
      machine_def: machine_defs_id (*),
      faults (
        *,
        created_by: created_by_user_id (*),
        resolved_by: resolved_by_user_id (*)
      ),
      prints (
        *,
        created_by: created_by_user_id (*),
        canceled_by: canceled_by_user_id (*)
      )
    `)
    .eq('id', params.slug)
    .order('created_at', { foreignTable: 'faults', ascending: false })
    .order('created_at', { foreignTable: 'prints', ascending: false })
    .returns<Machine[]>().maybeSingle();

  if (machine === null)
    throw error(404, 'Machine not found');

  return { session, machine, slug: params.slug }
}) satisfies PageServerLoad;

export const actions = {
  resolveFaultsMulti: async ({ request, locals: { supabase, getSession } }) => {
    const formData = await request.formData();
    const session = await getSession();

    const resolvedById = session?.user.id;
    if (!resolvedById) return { success: false };
    let resolveList: { id: string, success: boolean }[] = JSON.parse(formData.get('idArray') as string).map((id: string) => { return { id, success: false } });

    for (let job of resolveList) {
      const check = await supabase
        .from('faults')
        .select('*')
        .eq('id', job.id)
        .maybeSingle();

      if (check.data?.resolved)
        continue;

      const update = await supabase
        .from('faults')
        .update({
          resolved: true,
          resolved_by_user_id: resolvedById,
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