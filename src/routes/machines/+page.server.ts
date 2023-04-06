import type { Database } from "$lib/types/supabase";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export type Machine = Database['public']['Tables']['machines']['Row'] & {
    machine_def: Database['public']['Tables']['machine_defs']['Row']
}

export const load = (async ({ locals: { supabase, getSession } }) => {
    const session = await getSession();
    if (!session)
        throw redirect(303, '/');

    const { data: machines } = await supabase
        .from('machines')
        .select(`
            *,
            machine_def: machine_defs_id (
                *
            )
        `)
        .returns<Machine[]>();

    const { data: machineDefs } = await supabase
        .from('machine_defs')
        .select('*');

    return { session, machines, machineDefs }
}) satisfies PageServerLoad;