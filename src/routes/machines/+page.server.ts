import type { Fault, Machine } from "$lib/types/database";
import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async ({ locals: { supabase, getSession } }) => {
    const session = await getSession();
    if (!session)
        throw redirect(303, '/');

        const { data: machines } = await supabase
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
        .returns<Machine[]>();

    return { session, machines }
}) satisfies PageServerLoad;

export const actions = {
    resolveFault: async ({ request, locals: { supabase, getSession } }) => {
        const formData = await request.formData();
        const session = await getSession();

        const faultId = formData.get('faultId') as string;

        const resolvedById = session?.user.id;

        if (faultId === '' || resolvedById === undefined)
            return;

        console.log(faultId, resolvedById);

        let result = await supabase
            .from('fault_log')
            .update({
                resolved: true,
                resolved_by_id: resolvedById,
                resolved_at: new Date().toISOString()
            })
            .eq('id', faultId)
            .select();

        console.log(result);
    }
} satisfies Actions;