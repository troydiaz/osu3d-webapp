import type { Fault, Machine } from "$lib/types/database";
import { redirect } from "@sveltejs/kit";
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
            faults: fault_log (
                *,
                created_by: created_by_id (*),
                resolved_by: resolved_by_id (*)
            ),
            prints: print_log (
                *,
                created_by: created_by_id (*),
                cancelled_by: cancelled_by_id (*)
            )
        `)
        .eq('id', params.slug)
        .order('created_at', { foreignTable: 'faults', ascending: false })
        .order('created_at', { foreignTable: 'prints', ascending: false })
        .returns<Machine[]>()
        .single();

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
            let check = await supabase
                .from('fault_log')
                .select('*')
                .eq('id', job.id)
                .single();

            if (check.data?.resolved)
                continue;

            let update = await supabase
                .from('fault_log')
                .update({
                    resolved: true,
                    resolved_by_id: resolvedById,
                    resolved_at: new Date().toISOString()
                })
                .eq('id', job.id)
                .select().single();

            job.success = update.status === 200;
        }

        return {
            success: resolveList.filter(j => !j.success).length === 0
        }
    }
} satisfies Actions;